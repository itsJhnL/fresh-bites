import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Footer from "./Footer.jsx";
import {
  about,
  discount,
  hero,
  reviews,
  services,
  specialties,
} from "../data/data.js";
import { useShop } from "../context/ShopContext";

function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const { isFavorite, toggleFavorite, addToCart } = useShop();

  useEffect(() => {
    if (hero.length <= 1) {
      return undefined;
    }

    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % hero.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const slide = hero[activeSlide];

  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % hero.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? hero.length - 1 : prev - 1));
  };

  return (
    <>
      <section className="relative overflow-hidden bg-[linear-gradient(130deg,#fffaf2_0%,#ffe7dd_40%,#fff5df_100%)]">
        <div className="absolute inset-0">
          <img
            src={slide.backgroundImage}
            alt="Hero background"
            className="h-full w-full object-cover opacity-20"
          />
        </div>

        <div className="relative mx-auto grid min-h-[84vh] max-w-7xl items-center gap-8 px-5 py-14 md:grid-cols-2 md:py-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={`hero-copy-${slide.id}`}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.45 }}
              className="space-y-6 text-center md:text-left"
            >
              <p className="inline-block rounded-full border border-[#ff9f82] bg-white/80 px-4 py-2 text-sm font-semibold text-[#b24122]">
                Fast Delivery • Fresh Ingredients
              </p>
              <h1 className="text-4xl font-extrabold leading-tight text-[#1d3557] sm:text-5xl lg:text-6xl">
                {slide.title}
              </h1>
              <p className="mx-auto max-w-xl text-base font-medium text-[#2f3f54] sm:text-lg md:mx-0">
                {slide.subtitle}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                <NavLink
                  to="/Menu"
                  onClick={scrollUp}
                  className="rounded-full border-2 border-[#667B68] bg-[#667B68] px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-[#667B68]"
                >
                  Food Menu
                </NavLink>
                <NavLink
                  to="/Contact"
                  onClick={scrollUp}
                  className="rounded-full border-2 border-[#667B68] bg-white px-6 py-3 font-semibold text-[#667B68] transition hover:bg-[#667B68] hover:text-white"
                >
                  Book a Table
                </NavLink>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2 md:justify-start">
                {hero.map((heroSlide, index) => (
                  <button
                    key={heroSlide.id}
                    type="button"
                    onClick={() => setActiveSlide(index)}
                    className={`rounded-full transition ${
                      activeSlide === index
                        ? "h-2.5 w-8 bg-[#ff785b]"
                        : "h-2.5 w-2.5 bg-[#d8b8a8] hover:bg-[#cfa088]"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="relative flex items-center justify-center">
            <div className="absolute h-64 w-64 rounded-full bg-[#ff785b]/25 blur-3xl sm:h-72 sm:w-72" />
            <AnimatePresence mode="wait">
              <motion.img
                key={`hero-image-${slide.id}`}
                src={slide.imageURL}
                alt={slide.title}
                initial={{ opacity: 0, x: 40, scale: 0.92 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -32, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 h-[280px] w-full max-w-[560px] object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.2)] sm:h-[340px] md:h-[460px]"
              />
            </AnimatePresence>
          </div>
        </div>

        <button
          type="button"
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/85 px-3 py-2 text-xl font-bold text-[#334155] shadow-md transition hover:bg-white md:left-6"
          aria-label="Previous slide"
        >
          &#10094;
        </button>
        <button
          type="button"
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/85 px-3 py-2 text-xl font-bold text-[#334155] shadow-md transition hover:bg-white md:right-6"
          aria-label="Next slide"
        >
          &#10095;
        </button>

      </section>

      <section className="mx-auto max-w-7xl px-5 py-14">
        <div className="pb-10 text-center">
          <h1 className="text-lg font-semibold text-[#435334]">SPECIALTIES</h1>
          <p className="text-2xl font-bold text-[#00213F]">Our Special Dish</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {specialties.map((data, index) => {
            const isLiked = isFavorite(data.id);
            return (
              <motion.div
                key={data.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.06, duration: 0.3 }}
                className="flex h-full flex-col rounded-2xl border border-[#f3dfd6] bg-white p-5 shadow-md"
              >
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => toggleFavorite(data)}
                    className={`transition ${
                      isLiked ? "text-[#ff785b]" : "text-gray-500 hover:text-[#FF785B]"
                    }`}
                    aria-label={`Favorite ${data.subtitle}`}
                  >
                    {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </button>
                </div>

                <div className="flex flex-1 flex-col items-center pt-2">
                  <img
                    src={data.imageURL}
                    alt={data.subtitle}
                    className="h-44 w-44 object-contain"
                  />
                  <h2 className="flex min-h-[56px] items-center pt-4 text-center text-lg font-bold text-[#00213F]">
                    {data.subtitle}
                  </h2>
                  <p className="mt-2 rounded-full bg-[#fff3ec] px-3 py-1 text-sm font-bold text-[#ff785b]">
                    {data.price}
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => addToCart(data)}
                    className="flex w-full flex-nowrap items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#667B68] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#556657] active:scale-[0.98]"
                  >
                    <span className="truncate">Add to Cart</span>
                    <span className="shrink-0 rounded-lg bg-white/25 p-1 text-white">
                      <ShoppingCartOutlinedIcon fontSize="small" />
                    </span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="bg-[#fff] py-12">
        <div className="mx-auto max-w-6xl px-5 text-center">
          <h1 className="text-lg font-semibold text-[#435334]">WHAT WE SERVE</h1>
          <p className="text-2xl font-bold">
            Your Favorite Food <br /> Delivery Partner
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-1 md:grid-cols-3">
            {services.map((data, index) => (
              <motion.div
                key={data.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-2xl bg-[#f8fbff] p-5"
              >
                <img
                  src={data.imageURL}
                  alt={data.subtitle}
                  className="mx-auto h-[210px] w-[210px] object-contain"
                />
                <p className="text-lg font-bold text-[#00213F]">{data.subtitle}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-14 bg-[#FF785B] py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-6 md:grid-cols-2">
          {discount.map((data) => (
            <div key={data.id} className="contents">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <img
                  src={data.imageURL}
                  alt={data.title}
                  className="mx-auto h-72 w-full max-w-[460px] object-contain"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-5 text-center md:text-left"
              >
                <h2 className="text-3xl font-bold text-white">{data.title}</h2>
                <p className="text-base text-[#fff6f2]">{data.paragraph}</p>
                <NavLink
                  to="/Menu"
                  onClick={scrollUp}
                  className="inline-block rounded-full bg-white px-6 py-3 font-semibold text-[#FF785B] transition hover:bg-[#E8FBFF] hover:text-[#00213F]"
                >
                  Make Order
                </NavLink>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 bg-[#fff] py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center">
            <h1 className="text-lg font-semibold text-[#435334]">ABOUT US</h1>
            <p className="text-2xl font-bold">Why Choose Us?</p>
          </div>
          <div className="pt-10">
            {about.map((data) => (
              <div
                key={data.id}
                className="grid items-center gap-8 md:grid-cols-2"
              >
                <img
                  src={data.imageURL}
                  alt={data.title}
                  className="mx-auto h-80 w-full max-w-[460px] object-contain"
                />
                <div className="space-y-5 text-center md:text-left">
                  <h2 className="text-3xl font-bold text-[#00213F]">{data.title}</h2>
                  <p className="text-lg text-[#243447]">{data.paragraph}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fff] py-14">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center">
            <h1 className="text-lg font-semibold text-[#435334]">REVIEWS</h1>
            <p className="text-2xl font-bold">What Our Customer Says?</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((data, index) => (
              <motion.div
                key={data.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.05 }}
                className="relative rounded-xl border border-[#e8eef5] p-6 shadow-sm"
              >
                <span className="absolute right-4 top-4 text-gray-500">
                  <FormatQuoteIcon />
                </span>
                <div className="flex items-center gap-4 pb-5">
                  <div className="rounded-full bg-[#CEDEBD] p-2">
                    <div className="rounded-full bg-[#FFF] p-2">
                      <img
                        src={data.imageURL}
                        alt={data.name}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#00213F]">{data.name}</h2>
                    <p className="text-[#435334]">{data.subtitle}</p>
                  </div>
                </div>
                <p className="text-justify text-gray-700">{data.paragraph}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default HomePage;
