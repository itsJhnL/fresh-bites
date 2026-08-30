# FreshBite - Agent Instructions

## Mission

You are working on FreshBite, a functional online restaurant ordering application.

Your job is not merely to make the UI look good.

Your job is to produce a cohesive, functional, responsive and maintainable application.

---

# Before Writing Code

Always inspect the existing project first.

Determine:

- Framework
- Routing
- Component architecture
- Tailwind configuration
- Existing UI library
- State management
- Supabase configuration
- Existing API calls
- Existing components
- Existing pages
- Existing assets
- Existing business logic

Do not immediately replace the project.

---

# Existing Project Rule

FreshBite is being redesigned.

Preserve useful functionality.

Replace weak UI.

Refactor duplicated code.

Do not rewrite everything unnecessarily.

---

# Design Workflow

Follow this sequence:

## Step 1

Audit the existing UI.

Look for:

- Dead buttons
- Dead links
- Poor spacing
- Weak typography
- Inconsistent components
- Bad responsive behavior
- Missing loading states
- Missing errors
- Missing empty states
- Accessibility problems

## Step 2

Create a design direction.

FreshBite should feel like a real restaurant brand.

## Step 3

Create reusable design tokens/components.

## Step 4

Implement the redesigned experience.

## Step 5

Run responsive checks.

## Step 6

Run UX/accessibility checks.

## Step 7

Polish.

---

# Required Design Skills

Use:

Impeccable

Taste Skill

UI/UX Pro Max

Use them to improve the existing design rather than blindly generating generic UI.

---

# Interactive Elements

Every button must be functional.

Every link must navigate somewhere.

Every form must submit or validate.

Every modal must open and close.

Every dropdown must work.

Every quantity control must work.

Every filter must work.

Every search input must work.

No fake interactions.

---

# Buttons

Buttons must have:

- cursor-pointer
- hover state
- focus-visible state
- disabled state
- loading state when needed

Do not use a button for navigation when a semantic link is more appropriate.

---

# Forms

Every form must have:

- Labels
- Validation
- Error messages
- Loading state
- Success handling

Never rely solely on placeholder text as a label.

---

# Loading

Use skeleton components.

Avoid:

"Loading..."

as the only loading experience for content-heavy pages.

Use skeletons that resemble the final layout.

---

# Data Fetching

When fetching Supabase data:

1. Set loading state.
2. Fetch data.
3. Handle error.
4. Store data.
5. Render empty state when appropriate.
6. Stop loading.

Do not leave loading states active indefinitely.

---

# Supabase

Use the official Supabase client architecture appropriate to the project's framework.

Do not place service-role credentials in client-side code.

Use environment variables.

Use Row Level Security.

---

# Database

Keep database logic separated from presentation where practical.

Avoid putting complex database queries directly inside visual components.

Prefer reusable services/hooks/data-access functions.

---

# Authentication

Handle:

- Initial session loading
- Logged-in state
- Logged-out state
- Expired session
- Logout
- Protected routes

Avoid UI flashing between authenticated and unauthenticated states.

---

# Cart

Cart calculations must be deterministic.

Never calculate totals differently in different components.

Use one source of truth.

---

# Checkout

Before placing an order:

Validate:

- Authentication
- Cart
- Item availability
- Quantities
- Delivery information
- Payment selection

Then create the order.

---

# Demo Payment

Payment is simulated.

Never connect a real payment provider.

Never store card information.

Use obviously fake/demo payment values.

---

# Order Creation

Create:

1. Order
2. Order items
3. Demo payment status

Handle failures safely.

Do not clear the cart until order creation succeeds.

---

# Order Tracking

Order statuses:

pending
confirmed
preparing
ready
out_for_delivery
delivered
cancelled

The UI should clearly communicate the current state.

---

# Responsive Design

Test:

320px
375px
390px
414px
768px
1024px
1280px
1440px

Pay special attention to:

- Navigation
- Cart
- Checkout
- Food cards
- Modals
- Forms
- Order tracking

---

# Accessibility

Every page should have:

- Semantic HTML
- Logical heading hierarchy
- Keyboard support
- Focus states
- Form labels
- Accessible error messages
- Alt text
- Accessible dialogs
- Sufficient contrast

Do not remove focus outlines unless replacing them with an equally visible focus treatment.

---

# Icons

Use SVG icon components.

Prefer:

Lucide

Do not use emojis as functional UI icons.

---

# Animation

Use animation sparingly.

Good:

opacity
transform
scale
slide
fade

Avoid:

bounce
excessive spring
constant movement
large parallax effects

Respect reduced motion.

---

# Component Architecture

Prefer reusable components such as:

Navbar
MobileNav
FoodCard
FoodGrid
CategoryNav
SearchBar
CartDrawer
CartItem
QuantitySelector
PriceSummary
CheckoutForm
PaymentSelector
OrderStatus
OrderCard
Skeleton
EmptyState
ErrorState
Modal
Toast

---

# Code Quality

Do not:

- Duplicate business logic
- Hardcode secrets
- Ignore TypeScript errors
- Leave console errors
- Leave unused imports
- Leave placeholder TODO functionality
- Add unnecessary dependencies
- Build giant components

---

# Before Completion

Run a final checklist.

## Functionality

[ ] Authentication works

[ ] Menu works

[ ] Search works

[ ] Categories work

[ ] Food details work

[ ] Add to cart works

[ ] Cart updates work

[ ] Checkout works

[ ] Demo payment works

[ ] Order creation works

[ ] Confirmation works

[ ] Tracking works

[ ] Order history works

[ ] Profile works

[ ] Logout works

---

## UI

[ ] All buttons work

[ ] All links work

[ ] No dead navigation

[ ] No placeholder UI

[ ] Loading skeletons exist

[ ] Error states exist

[ ] Empty states exist

[ ] Responsive layout works

[ ] Mobile navigation works

---

## Accessibility

[ ] Keyboard navigation works

[ ] Focus states exist

[ ] Inputs have labels

[ ] Images have alt text

[ ] Dialogs are accessible

[ ] Contrast is acceptable

[ ] Reduced motion is respected

---

## Technical

[ ] Supabase environment variables are safe

[ ] RLS is configured

[ ] No secrets are exposed

[ ] No console errors

[ ] No obvious runtime errors

[ ] No unnecessary dependencies

[ ] No broken routes

---

# Final Principle

Do not ship something that only LOOKS like a restaurant application.

Ship something that BEHAVES like one.