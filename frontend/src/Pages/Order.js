import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import PriceSummary from "../components/PriceSummary";
import Skeleton from "../components/Skeleton";
import AddressForm from "../components/AddressForm";
import { fetchAddresses, createAddress } from "../lib/addressService";
import { createOrder } from "../lib/orderService";
import { toNumber, formatPeso } from "../utils/money";

const NEW_ADDRESS = "new";

// Consistent numbered "1 / 2 / 3" step header used across the three
// checkout sections so the page reads as one clear sequence.
function SectionHeader({ step, title }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-terracotta-500 text-sm font-bold text-cream-50">
        {step}
      </span>
      <h2 className="text-lg font-bold text-ink-900">{title}</h2>
    </div>
  );
}

const EMPTY_ADDRESS_FORM = {
  label: "",
  fullName: "",
  phone: "",
  addressLine: "",
  city: "",
  postalCode: "",
  deliveryNotes: "",
  saveAsDefault: false,
};

// All of the RPC's own RAISE EXCEPTION messages (supabase/migrations/003_functions.sql)
// are already written to be safe to show a user. Only a genuine network/transport
// failure (which never goes through the RPC's own error handling) gets swapped
// for a generic message here — everything else is shown as-is.
function friendlyOrderError(err) {
  const message = err?.message || "";
  if (!message || /fetch|network|timeout/i.test(message)) {
    return "Could not place your order. Please check your connection and try again.";
  }
  return message;
}

export default function Order() {
  const navigate = useNavigate();
  const { user } = useAuth();
  // Same cart, same calculateCartTotals() as the Cart page and Menu — never
  // a second independent computation of subtotal/delivery/total here.
  const { items: cartItems, subtotal, deliveryFee, discount, total, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [walletType, setWalletType] = useState("GCASH");
  const [isProcessing, setIsProcessing] = useState(false);
  const [form, setForm] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    walletNumber: "",
  });
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  // A synchronous, render-independent guard: setIsProcessing(true) below
  // only takes effect once React commits a re-render, which does not
  // happen fast enough to stop two click events dispatched in the same
  // tick (confirmed with a real double-click test) from both entering this
  // handler. A ref is checked/set immediately, before any render cycle.
  const isSubmittingRef = useRef(false);

  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [addressesError, setAddressesError] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState(EMPTY_ADDRESS_FORM);

  useEffect(() => {
    let active = true;
    setAddressesLoading(true);
    setAddressesError("");
    fetchAddresses()
      .then((data) => {
        if (!active) return;
        setAddresses(data);
        const defaultAddress = data.find((a) => a.is_default) || data[0];
        setSelectedAddressId(defaultAddress ? defaultAddress.id : NEW_ADDRESS);
      })
      .catch(() => {
        if (!active) return;
        // Non-fatal — checkout falls back to the new-address form so this
        // secondary read failing never blocks placing an order.
        setAddressesError("Could not load your saved addresses.");
        setSelectedAddressId(NEW_ADDRESS);
      })
      .finally(() => {
        if (active) setAddressesLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (cartItems.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="mx-auto max-w-xl rounded-xl border border-cream-200 bg-cream-50 p-8 text-center shadow-card">
          <h1 className="font-display text-2xl text-ink-900">No items to checkout</h1>
          <p className="mt-2 text-sm text-ink-500">
            Add items to your cart before placing an order.
          </p>
          <button
            type="button"
            onClick={() => navigate("/Menu")}
            className="mt-5 rounded-lg bg-sage-500 px-5 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-sage-600"
          >
            Go to Menu
          </button>
        </div>
      </section>
    );
  }

  const updateField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateDelivery = () => {
    if (selectedAddressId && selectedAddressId !== NEW_ADDRESS) {
      return "";
    }
    if (!addressForm.fullName.trim()) return "Please enter the recipient's full name.";
    if (!addressForm.phone.trim()) return "Please enter a phone number.";
    if (!addressForm.addressLine.trim()) return "Please enter a delivery address.";
    if (!addressForm.city.trim()) return "Please enter a city.";
    return "";
  };

  const validatePayment = () => {
    if (paymentMethod === "cod") return "";

    if (paymentMethod === "card") {
      if (!form.cardName.trim() || !form.cardNumber.trim() || !form.expiry.trim() || !form.cvv.trim()) {
        return "Please complete all card details.";
      }
      if (form.cardNumber.replace(/\s/g, "").length < 12) {
        return "Card number looks invalid.";
      }
      if (form.cvv.length < 3) {
        return "CVV looks invalid.";
      }
      return "";
    }

    if (!form.walletNumber.trim()) {
      return `Please enter your ${walletType} number.`;
    }
    if (form.walletNumber.replace(/\D/g, "").length < 10) {
      return `${walletType} number looks invalid.`;
    }

    return "";
  };

  const buildDeliveryAddressSnapshot = () => {
    if (selectedAddressId && selectedAddressId !== NEW_ADDRESS) {
      const existing = addresses.find((a) => a.id === selectedAddressId);
      return {
        label: existing.label,
        full_name: existing.full_name,
        phone: existing.phone,
        address_line: existing.address_line,
        city: existing.city,
        postal_code: existing.postal_code,
        delivery_notes: existing.delivery_notes,
      };
    }
    return {
      label: addressForm.label.trim() || null,
      full_name: addressForm.fullName.trim(),
      phone: addressForm.phone.trim(),
      address_line: addressForm.addressLine.trim(),
      city: addressForm.city.trim(),
      postal_code: addressForm.postalCode.trim() || null,
      delivery_notes: addressForm.deliveryNotes.trim() || null,
    };
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    if (isSubmittingRef.current) return;

    const deliveryError = validateDelivery();
    if (deliveryError) {
      setToast({ open: true, message: deliveryError, severity: "warning" });
      return;
    }
    const paymentError = validatePayment();
    if (paymentError) {
      setToast({ open: true, message: paymentError, severity: "warning" });
      return;
    }

    isSubmittingRef.current = true;
    setIsProcessing(true);
    try {
      const deliveryAddress = buildDeliveryAddressSnapshot();
      const isNewAddress = !selectedAddressId || selectedAddressId === NEW_ADDRESS;

      if (isNewAddress && user?.id) {
        // Best-effort save for next time — a failure here must never block
        // placing the order, since the snapshot above already has what's
        // needed.
        try {
          await createAddress(user.id, addressForm);
        } catch (saveErr) {
          console.error("Could not save address for reuse:", saveErr.message);
        }
      }

      const rpcPaymentMethod =
        paymentMethod === "cod" ? "cod" : paymentMethod === "card" ? "demo_card" : "demo_ewallet";

      // create_order() re-validates everything (auth, availability,
      // quantities) and recalculates subtotal/delivery/discount/total
      // itself from menu_items — nothing here is trusted as final pricing.
      const order = await createOrder({
        items: cartItems.map((item) => ({
          menu_item_id: item.menuItemId,
          quantity: item.quantity,
          customizations: item.customizations || [],
        })),
        paymentMethod: rpcPaymentMethod,
        deliveryAddress,
      });

      // The confirmation page (/order-confirmation/:orderNumber) fetches
      // this order fresh from Supabase — no client-side handoff of payment
      // details needed (and card/wallet numbers were never sent anywhere
      // to begin with; only payment_method/delivery_address/items were).
      clearCart();
      navigate(`/order-confirmation/${order.order_number}`, { replace: true });
    } catch (err) {
      setToast({
        open: true,
        message: friendlyOrderError(err),
        severity: "error",
      });
    } finally {
      isSubmittingRef.current = false;
      setIsProcessing(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-5 py-10">
      <div className="mb-6">
        <h1 className="font-display text-3xl text-ink-900">Checkout</h1>
        <p className="mt-1 text-sm text-ink-500">Confirm your delivery details and payment.</p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid items-start gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* 1. Delivery Details */}
          <div className="rounded-xl border border-cream-200 bg-cream-50 p-6 shadow-card">
            <SectionHeader step={1} title="Delivery Details" />

            {addressesLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-16 w-full rounded-lg" />
                <Skeleton className="h-16 w-full rounded-lg" />
              </div>
            ) : (
              <>
                {addressesError && (
                  <p className="mb-3 text-xs font-semibold text-red-600">{addressesError}</p>
                )}

                {addresses.length > 0 && (
                  <div className="space-y-2">
                    {addresses.map((address) => (
                      <label
                        key={address.id}
                        className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition ${
                          selectedAddressId === address.id
                            ? "border-sage-500 bg-sage-50"
                            : "border-cream-300 hover:border-sage-500"
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          className="mt-1 accent-sage-500"
                          checked={selectedAddressId === address.id}
                          onChange={() => setSelectedAddressId(address.id)}
                        />
                        <span>
                          <span className="block font-semibold text-ink-900">
                            {address.label || "Address"}
                            {address.is_default && (
                              <span className="ml-2 rounded-full bg-sage-100 px-2 py-0.5 text-xs font-semibold text-sage-600">
                                Default
                              </span>
                            )}
                          </span>
                          <span className="block text-ink-500">
                            {address.full_name} · {address.phone}
                          </span>
                          <span className="block text-ink-500">
                            {address.address_line}, {address.city}
                            {address.postal_code ? ` ${address.postal_code}` : ""}
                          </span>
                        </span>
                      </label>
                    ))}

                    <label
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm font-semibold transition ${
                        selectedAddressId === NEW_ADDRESS
                          ? "border-sage-500 bg-sage-50 text-ink-900"
                          : "border-dashed border-cream-300 text-ink-700 hover:border-sage-500"
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        className="accent-sage-500"
                        checked={selectedAddressId === NEW_ADDRESS}
                        onChange={() => setSelectedAddressId(NEW_ADDRESS)}
                      />
                      + Add a new address
                    </label>
                  </div>
                )}

                {selectedAddressId === NEW_ADDRESS && (
                  <div className={addresses.length > 0 ? "mt-4" : ""}>
                    <AddressForm value={addressForm} onChange={setAddressForm} />
                  </div>
                )}
              </>
            )}
          </div>

          {/* 2. Payment Method */}
          <div className="rounded-xl border border-cream-200 bg-cream-50 p-6 shadow-card">
            <SectionHeader step={2} title="Payment Method" />

            <div className="mb-4 flex items-start gap-2 rounded-lg border border-terracotta-100 bg-terracotta-50 px-3 py-2.5 text-xs font-semibold text-terracotta-700">
              <InfoOutlinedIcon fontSize="small" />
              <span>Demo payment — no real charge will be made.</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("cod")}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  paymentMethod === "cod"
                    ? "bg-terracotta-500 text-cream-50"
                    : "border border-cream-300 text-ink-700 hover:border-terracotta-500 hover:text-terracotta-500"
                }`}
              >
                <PaymentsOutlinedIcon fontSize="small" />
                Cash on Delivery
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  paymentMethod === "card"
                    ? "bg-terracotta-500 text-cream-50"
                    : "border border-cream-300 text-ink-700 hover:border-terracotta-500 hover:text-terracotta-500"
                }`}
              >
                <CreditCardOutlinedIcon fontSize="small" />
                Demo Card
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("wallet")}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  paymentMethod === "wallet"
                    ? "bg-terracotta-500 text-cream-50"
                    : "border border-cream-300 text-ink-700 hover:border-terracotta-500 hover:text-terracotta-500"
                }`}
              >
                <AccountBalanceWalletOutlinedIcon fontSize="small" />
                Demo E-Wallet
              </button>
            </div>

            {paymentMethod === "cod" && (
              <p className="mt-5 rounded-lg bg-cream-100 px-3 py-2.5 text-sm text-ink-700">
                Pay in cash when your order arrives.
              </p>
            )}

            {paymentMethod === "card" && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-semibold text-ink-700">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={form.cardName}
                    onChange={(e) => updateField("cardName", e.target.value)}
                    className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-500"
                    placeholder="Juan Dela Cruz"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-semibold text-ink-700">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={form.cardNumber}
                    onChange={(e) => updateField("cardNumber", e.target.value)}
                    className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-500"
                    placeholder="4242 4242 4242 4242 (demo)"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-ink-700">
                    Expiry
                  </label>
                  <input
                    type="text"
                    value={form.expiry}
                    onChange={(e) => updateField("expiry", e.target.value)}
                    className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-500"
                    placeholder="12/30"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-ink-700">CVV</label>
                  <input
                    type="password"
                    value={form.cvv}
                    onChange={(e) => updateField("cvv", e.target.value)}
                    className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-500"
                    placeholder="123"
                  />
                </div>
              </div>
            )}

            {paymentMethod === "wallet" && (
              <div className="mt-6 space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-ink-700">
                    Select Wallet
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["GCASH", "MAYA", "ACASH"].map((wallet) => (
                      <button
                        key={wallet}
                        type="button"
                        onClick={() => setWalletType(wallet)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                          walletType === wallet
                            ? "bg-terracotta-500 text-cream-50"
                            : "border border-cream-300 text-ink-700 hover:border-terracotta-500 hover:text-terracotta-500"
                        }`}
                      >
                        {wallet}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-ink-700">
                    {walletType} Number
                  </label>
                  <input
                    type="text"
                    value={form.walletNumber}
                    onChange={(e) => updateField("walletNumber", e.target.value)}
                    className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-500"
                    placeholder="09XXXXXXXXX"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. Order Summary — stays visible on scroll on desktop so the
            primary action (Place Order) is never buried below the form. */}
        <div className="h-fit rounded-xl border border-cream-200 bg-cream-50 p-6 shadow-card lg:sticky lg:top-24">
          <SectionHeader step={3} title="Order Summary" />
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-3 text-sm">
                <span className="text-ink-700">
                  {item.title} x{item.quantity}
                  {item.customizations?.length > 0 && (
                    <span className="block text-xs text-ink-300">
                      {item.customizations.map((c) => c.name).join(", ")}
                    </span>
                  )}
                </span>
                <span className="shrink-0 font-semibold text-ink-900">
                  {formatPeso(toNumber(item.price) * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-cream-200 pt-4">
            <PriceSummary subtotal={subtotal} deliveryFee={deliveryFee} discount={discount} total={total} />
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="mt-6 w-full rounded-lg bg-sage-500 px-4 py-3.5 text-base font-bold text-cream-50 shadow-card transition hover:bg-sage-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isProcessing ? "Placing Order..." : `Place Order — ${formatPeso(total)}`}
          </button>
          <div className="flex items-center justify-center gap-1.5 mt-3 text-center text-xs text-ink-500">
            <ReceiptLongOutlinedIcon fontSize="inherit" />
            <span>Final total is confirmed by the server before your order is placed.</span>
          </div>
        </div>
      </form>

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />
    </section>
  );
}
