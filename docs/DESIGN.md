---
name: Velocity Drive
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#574238'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#8a7266'
  outline-variant: '#ddc1b3'
  surface-tint: '#9d4400'
  primary: '#994200'
  on-primary: '#ffffff'
  primary-container: '#bd560b'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb68f'
  secondary: '#2e5ea3'
  on-secondary: '#ffffff'
  secondary-container: '#88b4ff'
  on-secondary-container: '#054488'
  tertiary: '#5c5c5c'
  on-tertiary: '#ffffff'
  tertiary-container: '#757474'
  on-tertiary-container: '#fffcfb'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbca'
  primary-fixed-dim: '#ffb68f'
  on-primary-fixed: '#331100'
  on-primary-fixed-variant: '#773200'
  secondary-fixed: '#d6e3ff'
  secondary-fixed-dim: '#a9c7ff'
  on-secondary-fixed: '#001b3e'
  on-secondary-fixed-variant: '#08468a'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#474746'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  headline-xl:
    fontFamily: manrope
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: workSans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: workSans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-bold:
    fontFamily: workSans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: workSans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin: 32px
---

## Brand & Style

The design system is engineered for a high-performance car rental experience, blending "Corporate Modern" precision with the kinetic energy of the automotive industry. It targets professional travelers and car enthusiasts who value efficiency, reliability, and premium quality. 

The aesthetic is characterized by a "Tech-Luxury" approach: heavy use of white space to denote cleanliness, high-contrast accents for immediate actionability, and subtle mechanical details that evoke the dashboard of a modern vehicle. The visual language moves away from generic e-commerce and toward a bespoke concierge service, utilizing precision-engineered layouts and smooth micro-interactions to build trust.

## Colors

The color palette is anchored in industrial stability and high-visibility accents. 
- **Primary (Dynamic Orange):** Reserved strictly for primary call-to-actions, status indicators (e.g., "Available"), and critical navigational highlights. It represents energy and the "Start" button of a car.
- **Secondary (Deep Sky Blue):** Used for secondary interactions, links, and informational tags, providing a cooling balance to the orange.
- **Tertiary (Anthracite):** The foundation for typography and structural elements, offering a grounded, serious tone that avoids the harshness of pure black.
- **Neutral (Arctic White):** The canvas for the entire system, ensuring the interface feels airy, premium, and hyper-clean.

## Typography

This design system utilizes a pairing of **Manrope** and **Work Sans** to achieve a robust, modern sans-serif look that mirrors automotive branding. 
- **Manrope** is used for headlines; its slightly condensed, geometric structure feels engineered and confident. 
- **Work Sans** handles body copy and labels; its exceptional legibility at small sizes ensures technical specifications (mileage, fuel type, price) are instantly readable. 
Uppercase styling is applied to labels and small buttons to evoke a sense of authority and navigation-grade clarity.

## Layout & Spacing

The system employs a **12-column fixed grid** for desktop, transitioning to a fluid single-column for mobile. The rhythm is based on an 8px square module, ensuring all components align with mathematical precision. 

Margins are generous (32px+) to maintain the premium feel. Large vertical spacing (XL) is used between sections to allow the automotive photography to breathe, while tighter spacing (XS/SM) is used within car "spec-cards" to keep related data points grouped and scannable.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and **Soft Ambient Shadows**. 
- Surfaces are primarily flat white. 
- Elevate "active" cards using an extremely diffused shadow: `0 12px 32px rgba(35, 35, 35, 0.08)`.
- Use a subtle light gray border (#F2F2F2) for inactive states to maintain structure without adding visual weight.
- When a user interacts with a car card, the elevation should increase slightly, accompanied by a subtle scale transform (1.02x) to simulate the car "approaching" the driver.

## Shapes

The design system adopts a **Soft (0.25rem)** roundedness profile. This mimics the precision-machined corners of modern car chassis and interior displays—not too organic/circular, but not dangerously sharp. 
- Standard components (buttons, inputs) use the base radius.
- Large containers and car image carousels use `rounded-lg` (0.5rem) to soften the overall interface and frame the vehicles elegantly.

## Components

### Buttons
- **Primary:** Anthracite background with white text, shifting to Orange on hover. Use a high-speed transition (150ms) for micro-interactions.
- **Ghost:** Thin 1px blue border for secondary actions like "View Details."

### Cards
- **Car Specs Card:** Minimalist white containers with a subtle 1px gray border. High-quality vehicle imagery must sit flush at the top. Data points (AC, Gearbox, Seats) use elegant wireframe icons.

### Input Fields
- Underlined or thinly bordered fields with "floating labels." The focus state uses a 2px blue bottom border to signify a "dashboard active" state.

### Chips & Badges
- Used for car categories (SUV, Sedan, Electric). Small, uppercase text with a light gray background. "New Arrival" or "Hot Deal" badges use the Primary Orange.

### Navigation
- A "Sticky" top header with a transparent-to-white transition on scroll. The search bar is the centerpiece, designed as a wide, persistent "Command Bar" for quick booking.

### Iconography
- 2px stroke-weight wireframe icons. Icons should be technical and literal (a physical key for "rent," a fuel pump for "gas").