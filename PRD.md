# FreshBite - Product Requirements Document

## 1. Product Overview

FreshBite is a modern online restaurant ordering web application.

The application allows customers to:

- Browse restaurant food
- Search and filter menu items
- View food details
- Add items to a cart
- Customize quantities
- Sign up and log in
- Manage their profile
- Enter delivery information
- Select a payment method
- Place an order
- View order confirmation
- View order history
- Track order status

The application will be connected to Supabase for authentication and database functionality.

Payment processing will be DEMO ONLY.

No real financial transaction must occur.

---

# 2. Product Vision

FreshBite should feel like a real commercial food-ordering platform rather than a portfolio mockup.

The interface should communicate:

- Fresh
- Appetizing
- Fast
- Modern
- Trustworthy
- Easy to use

The application should prioritize the ordering flow:

Browse → Select → Customize → Cart → Checkout → Payment → Confirmation → Tracking

---

# 3. Primary Users

## Customer

Customers can:

- Browse food
- Search menu
- Filter categories
- View food details
- Add food to cart
- Update cart
- Sign up
- Log in
- Manage profile
- Checkout
- Select payment method
- Place demo orders
- View order status
- View order history

## Guest

Guests can:

- Browse menu
- Search food
- View food details
- Add items to cart

Guests must be encouraged to authenticate before completing checkout.

---

# 4. Core Pages

## Public Pages

### Home

Sections:

- Navigation
- Hero
- Featured food
- Popular categories
- Popular dishes
- Promotional section
- Why FreshBite
- Customer testimonials
- Footer

Primary CTA:

"Order Now"

Secondary CTA:

"Explore Menu"

---

### Menu

Features:

- Category navigation
- Search
- Sorting
- Filtering
- Food cards
- Price
- Rating
- Availability
- Add to Cart
- Food details

Categories:

- Burgers
- Pizza
- Chicken
- Pasta
- Rice Meals
- Sides
- Desserts
- Drinks

Categories should be configurable from Supabase.

---

### Food Details

Display:

- Food image
- Name
- Description
- Price
- Rating
- Ingredients
- Availability
- Quantity selector
- Optional customization
- Add to Cart

Example:

Burger

Options:

- Size
- Extra cheese
- Extra sauce
- Remove onions
- Add bacon

Customization should affect the calculated price where applicable.

---

# 5. Authentication

Supabase Auth will be used.

Supported:

- Email/password registration
- Email/password login
- Logout
- Session persistence
- Password reset
- Protected routes

Optional future support:

- Google authentication

Authentication state must be reflected immediately throughout the UI.

Example:

Guest:

Login / Sign Up

Authenticated:

Profile / Orders / Logout

---

# 6. Cart

Cart must be functional.

Users can:

- Add food
- Remove food
- Increase quantity
- Decrease quantity
- Clear cart
- View subtotal
- View delivery fee
- View discount
- View total

Cart should persist appropriately.

For authenticated users, cart persistence may use Supabase.

For guests, cart may use localStorage.

---

# 7. Checkout

Checkout should contain:

## Delivery Information

- Full name
- Phone number
- Address
- City
- Postal code
- Delivery notes

## Order Summary

Display:

- Food
- Quantity
- Item price
- Subtotal
- Delivery fee
- Discount
- Total

## Payment

Demo payment methods:

- Cash on Delivery
- Demo Card
- Demo E-Wallet

IMPORTANT:

No actual payment gateway or financial transaction should be implemented.

The payment UI is for demonstration purposes.

---

# 8. Demo Payment

Payment must simulate a successful transaction.

Example:

User selects:

"Demo Card"

Then enters:

Card Number:
4242 4242 4242 4242

Expiration:
12/30

CVV:
123

The system should show:

"Payment successful"

No card information should actually be stored.

The application must clearly indicate:

"Demo payment - no real charge will be made."

---

# 9. Order Creation

When checkout is submitted:

1. Validate customer information
2. Validate cart
3. Calculate totals
4. Create order
5. Create order items
6. Assign demo payment status
7. Clear cart
8. Redirect to order confirmation

Example order status:

pending
confirmed
preparing
ready
out_for_delivery
delivered
cancelled

---

# 10. Order Confirmation

Display:

- Success state
- Order number
- Order total
- Payment method
- Delivery address
- Estimated delivery time
- Ordered items
- Current order status

CTA:

"Track Order"

Secondary:

"Continue Ordering"

---

# 11. Order Tracking

Customers can see:

Order Placed
↓
Confirmed
↓
Preparing
↓
Out for Delivery
↓
Delivered

The UI should visually indicate the current state.

For demo purposes, order progression may be manually controlled or simulated.

---

# 12. Profile

Authenticated users can:

- View profile
- Update name
- Update phone
- Update delivery address
- View order history
- Logout

---

# 13. Order History

Display:

- Order number
- Date
- Items
- Total
- Status
- Payment method

Actions:

- View Order
- Reorder

---

# 14. Supabase

Supabase should provide:

## Authentication

Supabase Auth.

## Database

Recommended tables:

### profiles

- id
- full_name
- phone
- avatar_url
- created_at
- updated_at

### categories

- id
- name
- slug
- description
- image_url
- sort_order
- is_active
- created_at

### menu_items

- id
- category_id
- name
- slug
- description
- price
- image_url
- rating
- preparation_time
- is_available
- is_featured
- created_at
- updated_at

### menu_item_options

- id
- menu_item_id
- name
- type
- price_modifier
- is_required

### addresses

- id
- user_id
- label
- full_name
- phone
- address_line
- city
- postal_code
- delivery_notes
- is_default
- created_at

### orders

- id
- user_id
- order_number
- status
- payment_method
- payment_status
- subtotal
- delivery_fee
- discount
- total
- delivery_address
- created_at
- updated_at

### order_items

- id
- order_id
- menu_item_id
- item_name
- quantity
- unit_price
- customizations
- total_price

---

# 15. Security

Supabase Row Level Security must be enabled.

Users should only be able to:

- Read their own profile
- Update their own profile
- Read their own orders
- Read their own order items
- Manage their own addresses

Public users may read active menu items and categories.

Admin functionality should not be exposed to customers.

Never expose:

- Supabase service role key
- Private API keys
- Payment secrets

Only public Supabase environment variables may be used on the frontend.

---

# 16. UI Requirements

Every interactive element must work.

No fake buttons.

No dead links.

No placeholder navigation.

Every button must have an intended action.

Examples:

"Order Now"
→ Menu

"View Details"
→ Food details

"Add to Cart"
→ Cart state updates

"Checkout"
→ Checkout

"Place Order"
→ Creates order

"Track Order"
→ Order tracking

"Reorder"
→ Adds previous items to cart

---

# 17. Responsive Design

The application must work on:

- 320px
- 375px
- 390px
- 414px
- 768px
- 1024px
- 1280px
- 1440px
- Large desktop screens

Mobile-first implementation is required.

Do not simply shrink the desktop UI.

Mobile navigation should be redesigned specifically for small screens.

---

# 18. Loading States

Skeleton loading must be implemented.

Required skeletons:

- Food cards
- Food details
- Profile
- Order history
- Order details
- Checkout
- Home sections

Avoid displaying blank screens while loading.

---

# 19. Error States

Every async operation must have:

- Loading state
- Success state
- Error state
- Empty state

Examples:

"No food found"

"Your cart is empty"

"Unable to load menu"

"Unable to place order"

"Your order history is empty"

---

# 20. UX Requirements

Use:

- Clear hierarchy
- Strong typography
- Accessible contrast
- Visible focus states
- Keyboard navigation
- Proper touch targets
- Smooth transitions
- Meaningful micro-interactions

Do not overuse:

- Cards
- Gradients
- Excessive rounded corners
- Glassmorphism
- Shadows
- Animations

The interface should feel like a real food brand.

---

# 21. Accessibility

Requirements:

- Semantic HTML
- Proper heading hierarchy
- Labels for inputs
- Keyboard accessibility
- Visible focus states
- Accessible buttons
- Alt text for images
- ARIA only when necessary
- Reduced-motion support
- Minimum comfortable touch target sizes

---

# 22. Design Direction

FreshBite should have a recognizable food identity.

Suggested direction:

Warm editorial restaurant aesthetic.

Use:

- Warm primary color
- Fresh secondary color
- Cream/off-white surfaces
- Deep food-inspired text color
- Strong photography
- Generous whitespace
- Editorial typography
- Subtle motion

Avoid making it look like:

- Generic SaaS
- Generic dashboard
- Generic Bootstrap template
- AI-generated restaurant template

The design should feel intentionally art-directed.

---

# 23. Motion

Use subtle motion for:

- Food card hover
- Add-to-cart feedback
- Cart updates
- Page transitions
- Loading states
- Order status changes
- Modal transitions

Respect:

prefers-reduced-motion

Do not use excessive bouncing or elastic animations.

---

# 24. Technical Requirements

Use:

- Tailwind CSS
- Supabase
- Responsive layout
- Component-based architecture
- Reusable components
- Environment variables
- Proper loading/error handling
- Type-safe code where supported

Avoid unnecessary dependencies.

---

# 25. Demo Restrictions

This is a demonstration project.

The application should simulate:

- Payments
- Order progression
- Restaurant operations

It must NOT:

- Charge real cards
- Store real card information
- Connect to a real payment processor
- Claim that payment is real

---

# 26. Definition of Done

FreshBite is complete when:

- Users can register
- Users can login
- Users can logout
- Menu loads from Supabase
- Search works
- Categories work
- Food details work
- Add to cart works
- Quantity updates work
- Cart totals work
- Checkout works
- Demo payment works
- Order creation works
- Order confirmation works
- Order tracking works
- Order history works
- Profile works
- All buttons work
- All navigation works
- Loading skeletons exist
- Empty states exist
- Error states exist
- Mobile UI works
- Desktop UI works
- Accessibility basics are implemented
- No fake interactive elements remain