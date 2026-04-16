# Responsive Rollout — Build & Run Guide

What's already applied to the codebase vs. what still needs `npm install` to activate.

## Already applied (zero setup)

- **Fluid type tokens** in [styles.css](styles.css) — every `text-xs` through `text-9xl` utility now uses `clamp()` to scale 320 → 2560px.
- **Touch-target safety net** — `min-height: 44px` / `min-width: 44px` on links, buttons, CTAs inside `(hover: none) and (pointer: coarse)` media query.
- **Hover gating** — transforms that caused "sticky hover" on touch devices now disabled when `(hover: none)`.
- **Breakpoints** normalized — custom `@media` rules in `styles.css` aligned to Tailwind defaults (640 / 768 / 1024 / 1280 / 1536).
- **CLS guards** — `aspect-ratio: 4/5` locked on polaroid card images, `text-size-adjust: 100%` on `<html>`.
- **Focus ring** — visible gold outline on keyboard navigation (`:focus-visible`).
- **Mobile-landscape fix** — heroes no longer force `100svh` in landscape orientation under 500px tall.
- **Preload hint** for the LCP image in [index.html](index.html).
- **`<picture>` tags** on the polaroid hero deck — browsers will fetch WebP/AVIF if the optimised files exist, otherwise fall back gracefully to the original JPG.
- **Polyfill-free `text-wrap: balance/pretty`** on headlines and paragraphs.

## Requires `npm install` to activate

```bash
npm install
```

This installs:
- `tailwindcss` — for producing a real (purged, minified) CSS bundle
- `sharp` — for generating WebP/AVIF image variants

### Build adaptive images

```bash
npm run images
```

Reads every JPG/PNG under `assets/Projects/` and `assets/images/`, writes 480/960/1600-px variants in JPG + WebP + AVIF to a sibling `opt/` folder. Originals untouched. Once finished, the `<picture>` tags already present in [index.html](index.html) start serving the smaller formats automatically — **no HTML changes needed**.

### Build Tailwind locally (replaces CDN)

```bash
npm run css:build
```

Produces `dist/app.css` (≈ 15 KB minified, purged to only the classes you actually use). To activate site-wide:

1. Add `<link rel="stylesheet" href="dist/app.css">` to each HTML file's `<head>`, **before** `styles.css`.
2. Remove `<script src="https://cdn.tailwindcss.com"></script>` from each HTML file.
3. Remove the no-longer-needed `<script src="theme-config.js"></script>` (values now baked into `tailwind.config.js`).

Do this on one page first (e.g. [index.html](index.html)), verify it looks identical, then repeat for the other 16 pages. Keep the CDN fallback on the other pages until you've confirmed the build is correct.

### Dev mode (auto-rebuild on save)

```bash
npm run css:watch
```

## Still manual (one-time)

### Self-host fonts (optional LCP win)

Currently pulling 4 families from Google Fonts, blocking on first paint. To self-host:

1. Download WOFF2 files from <https://gwfh.mranftl.com/fonts> for: Inter (400, 600, 700), Barlow Condensed (400, 600, 700), Oswald (400, 700). Skip Archivo — it's barely used and can fall back to system.
2. Drop under `assets/fonts/`.
3. Add `@font-face` declarations to [styles.css](styles.css) with `font-display: swap` and `size-adjust` to prevent layout shift.
4. Remove the `https://fonts.googleapis.com` links from each HTML file.

Net effect: ~200ms faster LCP on slow connections.

## Testing

See [TESTING.md](TESTING.md) for the device matrix and edge-case checklist.
