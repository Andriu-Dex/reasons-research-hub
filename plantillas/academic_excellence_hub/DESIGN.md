---
name: Academic Excellence Hub
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#424751'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#737783'
  outline-variant: '#c2c6d3'
  surface-tint: '#255dad'
  primary: '#00346f'
  on-primary: '#ffffff'
  primary-container: '#004a99'
  on-primary-container: '#9bbdff'
  inverse-primary: '#abc7ff'
  secondary: '#006688'
  on-secondary: '#ffffff'
  secondary-container: '#00c1fd'
  on-secondary-container: '#004b65'
  tertiary: '#323537'
  on-tertiary: '#ffffff'
  tertiary-container: '#494c4e'
  on-tertiary-container: '#babcbe'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d7e2ff'
  primary-fixed-dim: '#abc7ff'
  on-primary-fixed: '#001b3f'
  on-primary-fixed-variant: '#00458f'
  secondary-fixed: '#c2e8ff'
  secondary-fixed-dim: '#75d1ff'
  on-secondary-fixed: '#001e2b'
  on-secondary-fixed-variant: '#004d67'
  tertiary-fixed: '#e0e3e5'
  tertiary-fixed-dim: '#c4c7c9'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 1.5rem
  margin-mobile: 1rem
  margin-desktop: 2.5rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
---

## Brand & Style

The design system is engineered for a premium research environment, blending the rigor of academic institutions with the sleekness of modern technology hubs. It evokes feelings of trust, innovation, and intellectual clarity. 

The visual style is **Corporate / Modern** with a lean toward high-end **Minimalism**. It utilizes generous white space to allow complex data and research papers to breathe, while employing sophisticated tonal layering to guide the user's eye through information hierarchies. The aesthetic is "academic-forward"—clean, precise, and authoritative, but with interactive nuances that feel fluid and contemporary.

## Colors

The palette is anchored by a **Deep Navy Primary (#004A99)**, representing stability and institutional depth. This is complemented by a **Vibrant Cyan Secondary (#00C2FF)** used sparingly for calls-to-action and critical highlights to draw attention without overwhelming the scholarly tone.

The background system relies on a high-contrast relationship between pure white surfaces and a **Soft Slate Tertiary (#F8FAFC)** for subtle sectioning. Text is rendered in a **Rich Charcoal Neutral (#1E293B)** rather than pure black to ensure readability during long research sessions. Functional colors for success, error, and warning should follow a muted, professional spectrum that aligns with the primary blue's saturation.

## Typography

This design system utilizes **Inter** across all levels to maintain a systematic, utilitarian, and clean look. The typeface's tall x-height ensures exceptional legibility for dense research abstracts.

- **Headlines:** Use tighter letter-spacing and semi-bold/bold weights to create a strong visual anchor.
- **Body Text:** Optimized with generous line-height (1.5x) to prevent eye fatigue.
- **Labels:** Small caps or medium weights are used for metadata, tags, and navigation items to distinguish them clearly from prose.

## Layout & Spacing

The design system employs a **Fixed Grid** model for desktop to ensure content remains centered and readable on ultra-wide monitors, transitioning to a fluid layout for mobile devices.

- **Desktop (1200px+):** 12-column grid with 24px gutters.
- **Tablet (768px - 1199px):** 8-column grid with 16px gutters.
- **Mobile (Up to 767px):** 4-column grid with 16px gutters and 16px side margins.

Spacing follows an 8px base unit. Component internal padding should favor larger horizontal values (e.g., 24px) versus vertical values (16px) to create a sense of professional breadth.

## Elevation & Depth

Hierarchy is established through **Ambient Shadows** and **Tonal Layers**. Instead of harsh borders, surfaces use extra-diffused, low-opacity shadows (e.g., `0px 10px 30px rgba(0, 74, 153, 0.05)`) that incorporate a hint of the primary blue to keep the shadows "cool" and integrated.

Interactive elements use a "lift" metaphor:
- **Level 0 (Base):** Default background or tertiary color.
- **Level 1 (Cards):** White background with a subtle border (#E2E8F0) and soft shadow.
- **Level 2 (Hover):** Increased shadow spread and a slight upward translation (-2px) to signify interactivity.
- **Level 3 (Modals/Popovers):** Deepest shadows to indicate focus and separation from the primary workflow.

## Shapes

The design system adopts a **Rounded** shape language to soften the serious nature of academic content. Standard components like buttons and input fields use a 0.5rem radius. 

Large containers and feature cards use `rounded-lg` (1rem) to create a distinct, modern frame for images and data visualizations. This consistent rounding creates a "friendly-yet-precise" personality that differentiates the hub from traditional, boxy academic portals.

## Components

### Buttons
- **Primary:** Solid Primary Blue background with white text. Hover state involves a subtle shift to a deeper shade or the addition of a Cyan glow.
- **Secondary:** Outlined with Primary Blue. On hover, the background fills with a 5% opacity blue tint.
- **Interaction:** All buttons must have a 200ms transition on hover and active states.

### Research Cards
Cards are the primary data container. They feature a white surface, `rounded-lg` corners, and a subtle 1px border. The header of the card should use `label-sm` for categories (e.g., "AI RESEARCH") in the secondary cyan color to add a "pop" of visual interest.

### Navigation
The top navigation is clean and fixed, using a backdrop-blur (glassmorphism) when scrolling to maintain context without obscuring content. Navigation links use `label-md` with a 2px bottom border that animates in from the center on hover.

### Input Fields
Inputs use a soft grey border and transition to a 2px Primary Blue border on focus. Include a subtle blue outer glow (`ring`) to emphasize the active state.

### Chips & Tags
Used for research keywords. These should be pill-shaped with a light cyan background and navy text, ensuring high legibility and a modern "tech" feel.