import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useShop } from "../context/ShopContext";

const toNumber = (price) => Number(String(price || "0").replace(/[^\d.]/g, "")) || 0;
const formatPeso = (value) => `P${value.toFixed(2)}`;

export default function Order() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, clearCart } = useShop();
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
  const [lastPayment] = useState(() => {
    try {
      const raw = localStorage.getItem("lastPayment");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const isLoggedIn =
    localStorage.getItem("isLoggedIn") === "true" ||
    Boolean(localStorage.getItem("token"));

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + toNumber(item.price) * item.quantity, 0),
    [cartItems]
  );
  const serviceFee = subtotal > 0 ? 49 : 0;
  const total = subtotal + serviceFee;

  const query = new URLSearchParams(location.search);
  const isPaymentSuccess = query.get("status") === "success";

  if (!isLoggedIn) {
    navigate("/User?redirect=/Order");
    return null;
  }

  if (isPaymentSuccess) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="mx-auto max-w-xl rounded-2xl border border-[#dbe7d0] bg-[#f9fff3] p-8 shadow-sm">
          <div className="text-center">
            <div className="mx-auto mb-3 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#e7f8dc] text-[#4d8f1f]">
              <CheckCircleOutlineIcon fontSize="large" />
            </div>
            <h1 className="text-2xl font-bold text-[#1f2937]">Payment Successful</h1>
            <p className="mt-2 text-sm text-[#475569]">Your payment is complete.</p>
          </div>

          <div className="mt-6 rounded-xl border border-[#d8e7cd] bg-white p-4">
            <h2 className="text-sm font-bold text-[#334155]">Payment Details</h2>
            <div className="mt-3 space-y-1 text-sm text-[#475569]">
              <p>
                <span className="font-semibold text-[#1f2937]">Amount:</span>{" "}
                {lastPayment?.amount || formatPeso(total)}
              </p>
              <p>
                <span className="font-semibold text-[#1f2937]">Method:</span>{" "}
                {lastPayment?.method || "Payment"}
              </p>
              <p>
                <span className="font-semibold text-[#1f2937]">Paid With:</span>{" "}
                {lastPayment?.paidWith || "-"}
              </p>
              <p>
                <span className="font-semibold text-[#1f2937]">Reference:</span>{" "}
                {lastPayment?.reference || "-"}
              </p>
              <p>
                <span className="font-semibold text-[#1f2937]">Date:</span>{" "}
                {lastPayment?.date || new Date().toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/Menu")}
              className="rounded-xl bg-[#667B68] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#556657]"
            >
              Order Again
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-xl border border-[#d5dde5] px-5 py-2.5 text-sm font-semibold text-[#334155] transition hover:bg-[#f8fafc]"
            >
              Go Home
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (cartItems.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="mx-auto max-w-xl rounded-2xl border border-[#efe3d8] bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-[#00213F]">No items to checkout</h1>
          <p className="mt-2 text-sm text-[#64748b]">
            Add items to your cart before placing an order.
          </p>
          <button
            type="button"
            onClick={() => navigate("/Menu")}
            className="mt-5 rounded-xl bg-[#667B68] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#556657]"
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

  const validate = () => {
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

  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    const error = validate();
    if (error) {
      setToast({ open: true, message: error, severity: "warning" });
      return;
    }

    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const now = new Date();
    const reference = `FB-${now.getFullYear()}${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}${String(now.getDate()).padStart(2, "0")}-${Math.floor(
      100000 + Math.random() * 900000
    )}`;
    const maskedCard = form.cardNumber.replace(/\s/g, "").slice(-4);
    const maskedWallet = form.walletNumber.replace(/\D/g, "").slice(-4);
    const paymentSummary = {
      amount: formatPeso(total),
      method: paymentMethod === "card" ? "Credit Card" : "E-Wallet",
      paidWith:
        paymentMethod === "card"
          ? `Card ending in ${maskedCard || "****"}`
          : `${walletType} ending in ${maskedWallet || "****"}`,
      reference,
      date: now.toLocaleString(),
    };
    localStorage.setItem("lastPayment", JSON.stringify(paymentSummary));
    clearCart();
    setIsProcessing(false);
    navigate("/Order?status=success", { replace: true });
  };

  return (
    <section className="mx-auto max-w-7xl px-5 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#00213F]">Checkout & Payment</h1>
        <p className="mt-1 text-sm text-[#64748b]">Complete your payment to place the order.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <form
          onSubmit={handlePlaceOrder}
          className="rounded-2xl border border-[#efe3d8] bg-white p-6 shadow-sm lg:col-span-2"
        >
          <h2 className="text-xl font-bold text-[#1f2937]">Select Payment Method</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod("card")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                paymentMethod === "card"
                  ? "bg-[#667B68] text-white"
                  : "border border-[#d8dee7] text-[#334155] hover:border-[#667B68]"
              }`}
            >
              Credit Card
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("wallet")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                paymentMethod === "wallet"
                  ? "bg-[#667B68] text-white"
                  : "border border-[#d8dee7] text-[#334155] hover:border-[#667B68]"
              }`}
            >
              E-Wallet
            </button>
          </div>

          {paymentMethod === "card" ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-semibold text-[#334155]">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={form.cardName}
                  onChange={(e) => updateField("cardName", e.target.value)}
                  className="w-full rounded-lg border border-[#d5dde5] px-3 py-2 text-sm outline-none focus:border-[#667B68]"
                  placeholder="Juan Dela Cruz"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-semibold text-[#334155]">
                  Card Number
                </label>
                <input
                  type="text"
                  value={form.cardNumber}
                  onChange={(e) => updateField("cardNumber", e.target.value)}
                  className="w-full rounded-lg border border-[#d5dde5] px-3 py-2 text-sm outline-none focus:border-[#667B68]"
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#334155]">
                  Expiry
                </label>
                <input
                  type="text"
                  value={form.expiry}
                  onChange={(e) => updateField("expiry", e.target.value)}
                  className="w-full rounded-lg border border-[#d5dde5] px-3 py-2 text-sm outline-none focus:border-[#667B68]"
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#334155]">CVV</label>
                <input
                  type="password"
                  value={form.cvv}
                  onChange={(e) => updateField("cvv", e.target.value)}
                  className="w-full rounded-lg border border-[#d5dde5] px-3 py-2 text-sm outline-none focus:border-[#667B68]"
                  placeholder="123"
                />
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#334155]">
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
                          ? "bg-[#667B68] text-white"
                          : "border border-[#d8dee7] text-[#334155] hover:border-[#667B68]"
                      }`}
                    >
                      {wallet}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#334155]">
                  {walletType} Number
                </label>
                <input
                  type="text"
                  value={form.walletNumber}
                  onChange={(e) => updateField("walletNumber", e.target.value)}
                  className="w-full rounded-lg border border-[#d5dde5] px-3 py-2 text-sm outline-none focus:border-[#667B68]"
                  placeholder="09XXXXXXXXX"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isProcessing}
            className="mt-6 w-full rounded-xl bg-[#667B68] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#556657] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isProcessing ? "Processing Payment..." : `Pay ${formatPeso(total)}`}
          </button>
        </form>

        <div className="rounded-2xl border border-[#efe3d8] bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-[#1f2937]">Order Summary</h3>
          <div className="mt-4 space-y-3">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span className="text-[#334155]">
                  {item.title} x{item.quantity}
                </span>
                <span className="font-semibold text-[#1f2937]">
                  {formatPeso(toNumber(item.price) * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-2 border-t border-[#edf1f4] pt-4 text-sm">
            <div className="flex items-center justify-between text-[#475569]">
              <span>Subtotal</span>
              <span>{formatPeso(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-[#475569]">
              <span>Service Fee</span>
              <span>{formatPeso(serviceFee)}</span>
            </div>
            <div className="flex items-center justify-between text-base font-bold text-[#00213F]">
              <span>Total</span>
              <span>{formatPeso(total)}</span>
            </div>
          </div>
        </div>
      </div>

      <Snackbar
        open={toast.open}
        autoHideDuration={2200}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </section>
  );
}
