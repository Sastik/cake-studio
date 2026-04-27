# UI/UX Layout (Figma-style)

## Theme

- Background: `#FFFFFF`
- Primary: `#FADADD`
- Accent: `#FFC0CB`
- Soft tint: `#FFF0F5`
- Cards: glassmorphism (`white/70 + blur + subtle border`)
- Corners: 2xl
- Shadows: soft + pink glow for CTAs
- 3D-lite: floating gradient “cake tile” in hero + animated pastel blobs

## Mobile-first page layouts

### Home

1. Sticky Top Nav
   - Logo tile (rounded 2xl gradient)
   - Links: Cakes, Custom, Cart (badge)
2. Hero (glass card)
   - Left: value prop + 2 CTAs (Explore, Custom)
   - Right: floating “cake tile” with soft shadow
3. Featured (3 cards grid on desktop, stacked on mobile)
4. Benefits (3 glass cards)
5. Sticky bottom CTA: “Order on WhatsApp”

### Product Listing

- Header glass card (title + subtitle)
- Product grid: 1 column mobile, 3 columns desktop

### Cake Details

- Image hero (cover) + gradient fade
- Title, description, tags
- Primary action: Add to cart
- Secondary: Go to cart

### Custom Cake Request

- Form as one glass card
- Inputs: occasion, flavors, size, budget, date + notes
- Clear button

### Cart

- Line items as glass cards with qty stepper
- Subtotal + notes textarea
- Clear cart

## Component breakdown

- `Shell`: background FX + top nav + sticky WhatsApp CTA
- `BackgroundFX`: animated blobs (Framer Motion)
- `TopNav`: sticky glass header + cart badge
- `CakeCard`: glass card with image, tags, hover lift
- `StickyWhatsAppCTA`: pre-filled WhatsApp message from cart + custom request
- `CartProvider`: localStorage-backed cart + notes + custom request

