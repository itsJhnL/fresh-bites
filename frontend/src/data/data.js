// Content for the homepage only (src/components/HomePage.jsx). Menu items,
// categories, and featured dishes come from Supabase (src/lib/menuService.js)
// — this file is copy/illustrative content, not product data.

const hero = {
  eyebrow: "Fresh Bites",
  title: "Real Food, Made to Order",
  subtitle:
    "Chef-designed meals made from real ingredients, delivered to your door — order in seconds, enjoy in minutes.",
};

const chefSpecial = {
  eyebrow: "This Week's Highlight",
  title: "From Our Kitchen to Your Table",
  description:
    "Our kitchen rotates a seasonal favorite every week — vibrant, made-to-order, and built around whatever's freshest. Browse the full menu to see what's available today.",
  imageAlt: "A vibrant, fresh grain bowl with roasted vegetables and greens",
};

const services = [
  {
    id: 1,
    title: "Easy to Order",
    description: "Browse, customize, and check out in a few taps.",
  },
  {
    id: 2,
    title: "Fastest Delivery",
    description: "Your order reaches you fresh and on time.",
  },
  {
    id: 3,
    title: "Quality You Can Taste",
    description: "Every dish made fresh from real ingredients.",
  },
];

const about = {
  title: "A Kitchen Built Around Real Food",
  paragraph:
    "FreshBite started with one idea: food delivery shouldn't mean giving up on quality. Every dish on our menu is prepared fresh to order, using ingredients we'd be happy to cook with at home — no shortcuts, no reheated batches sitting under a heat lamp.",
};

const chefSection = {
  eyebrow: "Our Kitchen",
  title: "Cooked With Intention, Plated With Care",
  paragraph:
    "Behind every order is a kitchen team that treats each plate like it's the only one going out that night — fresh ingredients, made-to-order cooking, and real attention to detail from prep to pass.",
  imageAlt: "A chef carefully plating a dish under warm kitchen lighting",
};

// No `highlights` stat list here on purpose — every number that section
// shows on the homepage is computed live in HomePage.jsx from real data
// (menu item/category counts already fetched for other sections, the
// actual review array below, and the real delivery-time estimate constant
// in utils/orderLabels.js), rather than hardcoded/invented figures.

const restaurantInfo = {
  addressLabel: "Nueva Ecija, Philippines",
  addressQuery: "Nueva Ecija, Philippines",
  phone: "+63 912 345 6789",
  phoneHref: "tel:+639123456789",
  email: "info@freshbites.com",
  // No operating hours here — there's no real source for them (no hours
  // field anywhere in the schema/backend), so none are shown rather than
  // inventing a schedule.
};

// Illustrative demo reviews — this is a demo application with no real
// customer accounts yet, so these are shown without photos (an initial in
// a circle, not an implied real photograph of a real person).
const reviews = [
  {
    id: 1,
    name: "Emily T.",
    rating: 4,
    quote:
      "So juicy and flavorful! The marinade had a nice mix of herbs and spices — the smoky char was seriously satisfying.",
  },
  {
    id: 2,
    name: "David S.",
    rating: 5,
    quote: "Crispy base, loads of toppings, perfectly melted cheese. You can tell the ingredients are fresh.",
  },
  {
    id: 3,
    name: "William A.",
    rating: 5,
    quote: "Crispy outside, tender inside — the bun held together well. Filling and full of flavor.",
  },
  {
    id: 4,
    name: "Sophia R.",
    rating: 4,
    quote: "Thin crust, cheesy, spice level just right. Would order again without thinking twice.",
  },
  {
    id: 5,
    name: "Michael A.",
    rating: 5,
    quote: "Crispy, juicy, not greasy at all. Portion size was perfect for sharing with the table.",
  },
];

module.exports = { hero, chefSpecial, services, about, chefSection, restaurantInfo, reviews };
