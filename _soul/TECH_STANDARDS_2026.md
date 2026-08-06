# 2026 Technical & Conversion Standards

## 1. Core Web Vitals
- **LCP (Largest Contentful Paint):** < 1.2s
- **INP (Interaction to Next Paint):** < 100ms
- **CLS (Cumulative Layout Shift):** 0.0

## 2. Design Aesthetics & UX
- **Vibrant & Premium:** Avoid generic colors. Use curated HSL palettes, smooth gradients, and sleek dark modes if appropriate for the niche.
- **Typography:** Modern fonts (Inter, Roboto, Outfit). High contrast, clear hierarchy (one H1 per page).
- **Micro-interactions:** Elements should feel alive. Use subtle hover effects, active states, and transition animations without causing layout shifts.
- **Glassmorphism:** Use sparingly for modern, layered UI elements (like sticky navs or floating CTAs).

## 3. Form Friction Rules
- **Minimize Fields:** Only ask for what is strictly necessary. (e.g., Name, Email, Phone, URL).
- **Progressive Disclosure:** For longer inquiries, use multi-step forms instead of a single massive wall of inputs.
- **Clear Validation:** Real-time, inline validation with helpful error messages.
- **Autofill Support:** Ensure all inputs have proper `autocomplete` attributes.

## 4. Architecture & SEO
- **Semantic HTML:** `<header>`, `<main>`, `<section>`, `<footer>`, `<article>`.
- **Schema Markup:** Inject appropriate JSON-LD (LocalBusiness, Service) dynamically or statically per prospect.
- **Accessibility:** WCAG 2.2 AA compliant. ARIA labels where necessary, high contrast, keyboard navigable.
