# FreshBite - Project Memory

## Project Identity

Project name:

FreshBite

Project type:

Online restaurant food-ordering application.

Primary purpose:

Functional demonstration of a production-style restaurant ordering experience.

---

# Product Philosophy

FreshBite is NOT a static landing page.

FreshBite is NOT just a UI mockup.

FreshBite should behave like a real food-ordering application.

The frontend must communicate with Supabase where appropriate.

---

# Backend

Primary backend:

Supabase

Use Supabase for:

- Authentication
- Database
- Profiles
- Menu
- Categories
- Addresses
- Orders
- Order items

---

# Payment

Payment is DEMO ONLY.

Never implement real financial transactions.

Never store real card details.

Never expose payment credentials.

The payment screen should clearly communicate:

"Demo payment - no real charge will be made."

---

# Frontend

Primary styling:

Tailwind CSS

Prioritize:

- Responsive design
- Reusable components
- Accessibility
- Performance
- Clean architecture

---

# Interaction Rule

Every interactive element must work.

Buttons must:

- Have an action
- Have hover state
- Have focus state
- Have disabled state when appropriate
- Show loading state when asynchronous

Links must lead somewhere meaningful.

Do not create decorative buttons that look functional.

---

# Loading Rule

Never show an unexplained blank area while fetching data.

Use skeleton loaders for:

- Menu
- Food details
- Profile
- Orders
- Checkout
- Home dynamic content

---

# Error Rule

Every async operation must have an error state.

Never expose raw:

SQL errors
Supabase errors
stack traces
technical exceptions

to normal users.

Translate errors into useful UX messages.

---

# Empty State Rule

Every collection must have an intentional empty state.

Examples:

Empty cart:

"Your cart is waiting for something delicious."

No orders:

"You haven't placed an order yet."

No search results:

"We couldn't find anything matching your search."

---

# Responsive Rule

Design mobile-first.

Supported widths include:

320px
375px
390px
414px
768px
1024px
1280px
1440px+

Never assume desktop width.

---

# Visual Rule

FreshBite should feel:

Fresh
Warm
Modern
Appetizing
Premium
Fast
Trustworthy

Avoid generic AI-generated UI patterns.

Avoid excessive:

Cards
Gradients
Glass effects
Shadows
Rounded containers
Animations

---

# Typography

Typography must create hierarchy.

Do not default to generic typography without evaluating whether it fits the brand.

Use a deliberate display/body pairing.

---

# Icons

Use a consistent icon library.

Preferred:

Lucide icons or another professional SVG icon system.

Do not use emojis as UI icons.

---

# Motion

Motion should communicate:

- Interaction
- Feedback
- Navigation
- State changes

Use short, natural transitions.

Respect:

prefers-reduced-motion

Never use excessive bouncing.

---

# Data

Do not hardcode production-like dynamic data in components when it belongs in Supabase.

Static demo seed data is acceptable for initial database population.

---

# Authentication

Authentication state must be globally available where needed.

Unauthenticated users may browse.

Checkout requires authentication.

---

# Cart

Guests may use a local cart.

Authenticated users should have persistent cart behavior where practical.

The cart must always correctly calculate:

Subtotal
Delivery fee
Discount
Total

---

# Orders

Orders must preserve a snapshot of purchased item information.

Order items should retain:

- Item name
- Quantity
- Unit price
- Customizations
- Total

Do not rely only on the current menu item after an order has been created.

---

# Security

Never expose:

Supabase service role key
Private secrets
Payment secrets

Frontend should only use safe public environment variables.

Use Row Level Security.

---

# Development Rule

Before modifying a component:

Understand how it currently works.

Before replacing a feature:

Check whether another part of the application depends on it.

Do not unnecessarily rewrite working business logic.

---

# Design Skills

The project uses:

- Impeccable
- Taste Skill
- UI/UX Pro Max

Use them as design guidance.

Do not allow the skills to blindly override working application architecture.

---

# Priority Order

When making decisions, prioritize:

1. Functionality
2. UX
3. Accessibility
4. Responsiveness
5. Visual quality
6. Performance
7. Maintainability

---

# Golden Rule

If a feature looks clickable, it must be clickable.

If a feature looks like it is loading, it must have a loading state.

If a feature can fail, it must have an error state.

If a collection can be empty, it must have an empty state.

If a user can perform an action, the UI must clearly communicate the result.