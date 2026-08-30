import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import Footer from "../components/Footer";

const values = [
  {
    id: 1,
    icon: SpaOutlinedIcon,
    title: "Cooked to Order",
    description:
      "Nothing sits under a heat lamp waiting for a customer. Your dish starts once your order lands.",
  },
  {
    id: 2,
    icon: BoltOutlinedIcon,
    title: "Built for Speed",
    description:
      "From browsing the menu to tracking your delivery, every step is designed to move quickly and stay simple.",
  },
  {
    id: 3,
    icon: FavoriteBorderOutlinedIcon,
    title: "Honest, Always",
    description:
      "What you see is what you get — real prices, real order status, no surprise fees tucked into checkout.",
  },
];

export default function About() {
  return (
    <>
      {/* Intro */}
      <section className="bg-terracotta-500">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center text-cream-50">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-terracotta-100">
            About FreshBite
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">
            Good food, ordered simply.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-terracotta-50">
            FreshBite is a food-ordering platform built around one idea: getting a great
            meal to your door shouldn't be complicated, slow, or dishonest about what
            you're paying for.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-3xl px-5 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-3xl text-ink-900">Our Story</h2>
          <div className="mt-5 space-y-4 text-left text-base leading-relaxed text-ink-700 sm:text-center">
            <p>
              FreshBite started as a simple question: what would ordering food online look
              like if it were built by people who actually cared about the details? Not
              another checkout form bolted onto a menu, but an ordering experience that
              feels considered from the first click to the moment your food arrives.
            </p>
            <p>
              We're a small platform, still growing our menu and our kitchen partners.
              What we already believe in is transparency — clear pricing calculated the
              same way every time, order tracking that reflects what's actually happening,
              and a checkout that never pretends to be something it isn't.
            </p>
            <p>
              We're not chasing trends or gimmicks. We're chasing the basics done well:
              a menu worth browsing, an order flow that doesn't get in your way, and food
              that's worth the wait.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Values */}
      <section className="bg-cream-100 py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center">
            <h2 className="font-display text-3xl text-ink-900">What We Stand For</h2>
            <p className="mt-2 text-sm text-ink-500">
              A few things we hold ourselves to on every order.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.id} className="rounded-xl bg-cream-50 p-6 text-center shadow-card">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage-100 text-sage-600">
                    <Icon fontSize="medium" />
                  </div>
                  <p className="mt-4 text-base font-bold text-ink-900">{value.title}</p>
                  <p className="mt-1 text-sm text-ink-500">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-5 py-16 text-center">
        <h2 className="font-display text-3xl text-ink-900">Hungry yet?</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink-500">
          Take a look at what's on the menu today and see for yourself.
        </p>
        <div className="mt-6">
          <NavLink
            to="/Menu"
            className="inline-block rounded-full bg-terracotta-500 px-6 py-3 text-sm font-bold text-cream-50 transition hover:bg-terracotta-600"
          >
            Explore the Menu
          </NavLink>
        </div>
      </section>

      <Footer />
    </>
  );
}
