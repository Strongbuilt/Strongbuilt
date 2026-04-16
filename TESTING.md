<!-- markdownlint-disable MD013 -->
# Front-End Performance & Typography Optimization Guide

> [!NOTE]
> **Objective**: A technical guide for optimizing text and images to ensure seamless, accessible experiences with a "Mobile-First" and "Laptop-Optimized" approach, prioritizing Core Web Vitals (LCP, CLS).

## 1. Text Optimization & Responsive Typography

### The System: Typography Scale & Accessibility

Establishing a robust typography system begins with relative units. Using `rem` (root em) ensures that your typography scales based on the user's browser or OS-level font size settings.

- `1rem` typically equals `16px`.

- **Accessibility Benefit**: If a visually impaired user increases their browser default font size to `24px`, using `rem` allows your entire typographic hierarchy to scale proportionately without breaking the layout. Hardcoding in `px` overrides user preferences and violates WCAG 2.1 guidelines.

### Fluid Typography

Responsive design traditionally relies on discrete media queries, which can cause jarring layout shifts between breakpoints. **Fluid typography** uses the CSS `clamp()` function to create smooth transitions across screen sizes.

`clamp(minimum, preferred, maximum)`

```css
:root {
  /* Scales smoothly from 1rem to 3rem, based on viewport width */
  --font-size-h1: clamp(1.5rem, 2vw + 1rem, 3rem);
  --font-size-body: clamp(1rem, 0.5vw + 0.875rem, 1.125rem);
}

h1 { font-size: var(--font-size-h1); }
p { font-size: var(--font-size-body); }
```

### Breakpoint Typography Table

| Element | Mobile (< 768px) | Tablet (768px - 1024px) | Laptop/Desktop (> 1024px) |
| :--- | :--- | :--- | :--- |
| **H1** | `2rem` (32px) | `2.5rem` (40px) | `3rem` (48px) |
| **H2** | `1.75rem` (28px) | `2rem` (32px) | `2.5rem` (40px) |
| **H3** | `1.5rem` (24px) | `1.75rem` (28px) | `2rem` (32px) |
| **H4** | `1.25rem` (20px) | `1.5rem` (24px) | `1.5rem` (24px) |
| **Body** | `1rem` (16px) | `1rem` (16px) | `1.125rem` (18px) |

### Readability

To prevent eye fatigue, especially on ultra-wide laptop screens, restrict the width of text blocks and maintain vertical rhythm.

```css
p {
  line-height: 1.5; /* Optimal vertical spacing for legibility */
  max-width: 65ch; /* Limits width to ~45-75 characters */
  margin-inline: auto; /* Centers the reading block */
}
```

## 2. Advanced Image Strategy

### Format Hierarchy

Serve the smallest, highest-quality image format universally supported.

1. **AVIF**: Next-gen format. Superior compression and quality (especially at low bitrates).
2. **WebP**: Widely supported next-gen format. Better than JPEG/PNG.
3. **SVG**: For vectors, logos, and icons (resolution-independent and tiny).
4. **Optimized JPEG/PNG**: Fallbacks for older browsers.

### The `<picture>` Element: The Golden Standard

Use the `<picture>` element with `srcset` to dynamically serve the correct format and resolution based on device capabilities.

```html
<picture>
  <!-- 1. Serve AVIF to modern browsers -->
  <source type="image/avif" srcset="hero-image.avif">
  
  <!-- 2. Serve WebP as a fallback next-gen format -->
  <source type="image/webp" srcset="hero-image.webp">
  
  <!-- 3. Standard fallback with Resolution Descriptors -->
  <img 
    src="hero-image-fallback.jpg" 
    srcset="hero-image-fallback.jpg 1x, hero-image-fallback@2x.jpg 2x" 
    alt="Descriptive keyword-rich text for accessibility"
    width="1200" 
    height="800"
    loading="eager"
    fetchpriority="high"
  >
</picture>
```

### Loading & Logic

> [!IMPORTANT]  
> Proper loading logic directly impacts Largest Contentful Paint (LCP).

- **Lazy Loading**: Delay loading of off-screen images until the user scrolls near them. Saves bandwidth and speeds up initial render.

  ```html
  <img src="below-fold.webp" loading="lazy" alt="...">
  ```

- **Priority Hints**: Tell the browser which resources are critical. Use `fetchpriority="high"` strictly for **above-the-fold Hero images** to pre-emptively boost LCP.

### Visual Stability (Preventing CLS)

When an image loads without reserved space, it pushes down subsequent content, devastating the Cumulative Layout Shift (CLS) metric.

**Solution:** Always define explicit dimensions or use CSS `aspect-ratio` so the browser computes layout space immediately.

```css
img {
  max-width: 100%;
  height: auto;
  aspect-ratio: 16 / 9; /* Reserves space before load */
}
```

## 3. Mobile vs. Laptop Nuances

### Mobile Specifics

- **Touch Targets**: Thumbs are imprecise. All interactable UI elements (buttons, links) must have a minimum touch target size of `44x44px` (WCAG 2.1 standard).

  ```css
  button, a {
    min-width: 44px;
    min-height: 44px;
    padding: 12px 16px; /* Adjust padding to reach 44px dimensions */
  }
  ```

- **High-DPI (Retina) Displays**: Mobile screens often have higher pixel density. Serve `2x` or `3x` assets using `<img srcset="...">` to prevent blurriness.

### Laptop/Desktop Specifics

- **Hover States**: Since mobile is touch-only, laptops require robust hover/focus states to indicating interactivity. Use transitions to soften edge interactions.

  ```css
  button:hover, button:focus-visible {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transition: all 0.3s ease;
  }
  ```

- **Large-Format Backgrounds & Whitespace**: On large monitors, a `max-width` on main containers prevents hero images from stretching infinitely. Utilize the extra whitespace to let content "breathe" instead of spanning edge-to-edge.

## 4. Performance & Audit

To verify implementations, utilize **Chrome DevTools**:

- **Network Tab**:
  - Ensure the "Type" column displays `avif` or `webp`.
  - Simulate "Fast 3G" to observe how loading logic (`lazy` vs `eager`) executes.
  - Check the "Waterfall" to ensure Hero images download early (thanks to `fetchpriority="high"`).

- **Lighthouse**:
  - Run a "Performance" and "Accessibility" audit.
  - Verify that **CLS is 0** and **LCP is < 2.5s**.
  - Review touch target warnings under the Accessibility section.
