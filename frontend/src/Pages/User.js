import Login from "../components/Login";

export default function User() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-12">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-[#00213F]">Account</h1>
        <p className="mt-1 text-sm text-[#64748b]">
          Login to place orders and manage your cart.
        </p>
      </div>
      <Login />
    </section>
  );
}
