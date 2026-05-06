---
name: Regency Mining Intelligence
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
  on-surface-variant: '#3e4949'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#6e7979'
  outline-variant: '#bdc9c8'
  surface-tint: '#006a6a'
  primary: '#006767'
  on-primary: '#ffffff'
  primary-container: '#0f8282'
  on-primary-container: '#f3fffe'
  inverse-primary: '#78d6d5'
  secondary: '#006c47'
  on-secondary: '#ffffff'
  secondary-container: '#75fbbb'
  on-secondary-container: '#00734c'
  tertiary: '#595c5e'
  on-tertiary: '#ffffff'
  tertiary-container: '#727577'
  on-tertiary-container: '#fbfdff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#95f2f1'
  primary-fixed-dim: '#78d6d5'
  on-primary-fixed: '#002020'
  on-primary-fixed-variant: '#004f50'
  secondary-fixed: '#75fbbb'
  secondary-fixed-dim: '#55dea1'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005235'
  tertiary-fixed: '#e0e3e5'
  tertiary-fixed-dim: '#c4c7c9'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  title-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  container-padding: 20px
  grid-columns: '4'
---

## Brand & Style

The design system is engineered to project an image of "Governmental Futurism"—a synthesis of authoritative transparency and high-tech efficiency. Designed specifically for the administrative landscape of Bandung Regency, the aesthetic prioritizes trust, ecological oversight, and enterprise-grade reliability. 

The style utilizes **Minimalism** as its structural foundation, layered with **Glassmorphism** to symbolize the transparency of public data. By combining a "Smart City" ethos with clean, spacious layouts, the UI evokes a sense of calm control over complex industrial data. It moves away from traditional, bureaucratic "heavy" interfaces toward a breathable, modern Android experience that feels like a premium digital tool rather than a standard government form.

## Colors

The palette is anchored by **Primary Emerald**, representing the natural resources and environmental stewardship of the regency, and **Secondary Tosca**, which adds a modern, energetic "smart-tech" vibrance. 

The background is a pristine **Clean White**, ensuring maximum readability and a high-end enterprise feel. Soft gradients are used sparingly—primarily for primary actions and data highlights—to create depth without clutter. The use of semi-transparent white for glassmorphic layers allows the primary colors to subtly bleed through, creating a cohesive, multi-dimensional atmosphere.

## Typography

This design system exclusively employs **Plus Jakarta Sans** for its contemporary, geometric character and exceptional legibility on mobile screens. 

The typographic hierarchy is strictly enforced to manage high-density reporting data. Headlines use heavier weights and tighter letter-spacing for a confident, editorial look. Body text remains open and airy to facilitate long-form reading of environmental reports. Small labels and metadata utilize an uppercase, tracked-out style to provide clear categorization without competing with primary information.

## Layout & Spacing

The layout philosophy follows a **Fluid Grid** model optimized for the Android ecosystem. A 4-column grid serves as the structural skeleton, with a generous 20px container margin to maintain a "super premium" sense of whitespace. 

The spacing rhythm is based on a 4px baseline, ensuring all elements—from icon padding to card margins—are mathematically harmonious. We utilize dynamic vertical padding in glassmorphic cards to create a sense of internal "breathing room," distinguishing this system from dense, traditional government applications.

## Elevation & Depth

Visual hierarchy is established through a combination of **Glassmorphism** and **Ambient Shadows**. 

1.  **The Base:** A clean white background with subtle, large-scale gradients in the corners to provide a soft color hint.
2.  **The Glass Layer:** Elevated panels use a backdrop-blur (20px to 40px) with a semi-transparent white fill. This creates a frosted-glass effect that feels light and futuristic.
3.  **Shadows:** Instead of harsh black shadows, we use extra-diffused, low-opacity shadows tinted with the Primary Emerald hex (#208a8a). These shadows are "soft-touch," having a large blur radius (30px+) and very low alpha (8-12%) to simulate natural light falling on a premium surface.
4.  **Borders:** Each elevated element features a ultra-thin (1px) semi-transparent white border to simulate a "glass edge" highlight.

## Shapes

The shape language is defined by ultra-soft, **2xl rounded corners**. Following the `roundedness: 2` scale, standard UI cards and containers utilize a 24px (1.5rem) corner radius. This high degree of rounding removes the "sharpness" associated with rigid software, making the reporting process feel more approachable and modern.

Secondary elements like input fields and smaller chips follow this curve with a 12px or 16px radius, ensuring a consistent visual thread of "smoothness" across the entire interface.

## Components

### Buttons
Primary buttons use the Emerald-to-Tosca gradient with a subtle inner glow on the top edge. They are 2xl rounded, nearly pill-shaped, but with enough structure to feel professional. Text is bold and white for maximum contrast.

### Cards
Cards are the primary data containers. They must feature a subtle glass effect with a 1px soft-white stroke. Content inside cards should be grouped with generous internal padding (min 20px).

### Input Fields
Inputs are clean white with a very soft Primary Emerald outline when focused. They utilize "floating labels" to maximize space and maintain a futuristic feel.

### Minimal Outline Icons
Icons are strictly 2px stroke weight with rounded terminals. They should be monochromatic (using Primary Emerald or a deep slate) to maintain the clean, "smart city" aesthetic.

### Data Visualizations
Charts and graphs should use the secondary Tosca color for positive data and the Primary Emerald for neutral/structural data. Fills in area charts should use a vertical gradient from Primary Emerald to transparent.

### Status Badges
Status indicators (e.g., "Approved," "Pending") use a high-transparency version of the status color with a saturated 1px border, creating a glass-tag effect.