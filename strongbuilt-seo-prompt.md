# Strong Built — Complete SEO Prompt (All Pages)

> Paste this entire file into Cursor / Windsurf / Claude Code as a single prompt. It is designed for the React + Vite site deployed on Netlify at `strongbuiltofficial.netlify.app`. Goal: every page ranks, every page previews correctly on WhatsApp / LinkedIn / Google, every page loads fast, and the Mumbai market finds this company when searching "construction firm Mumbai" and related queries.

---

## 1. Project Context

**Site:** Strong Built — a Mumbai-based construction firm (est. 2014) with 90+ buildings delivered across residential, commercial, and institutional projects. Sub-brand of Skyway Group.

**Stack:** React 18 + Vite + React Router + Tailwind, hosted on Netlify.

**Pages:**
- `/` — Home
- `/story` — Our Story
- `/leadership` — Leadership team
- `/culture` — Culture
- `/recognition` — Awards & recognition
- `/projects` — Portfolio
- `/map` — Project map
- `/services` — Services
- `/clients` — Clients list
- `/investors` — Investors
- `/csr` — CSR
- `/careers` — Careers
- `/resources` — Resources
- `/contact` — Contact

**Target audiences:** property developers looking for construction partners, investors, prospective clients searching for "construction company in Mumbai" / "contractor Mumbai" / "high-rise builder Mumbai", potential employees, press.

**Primary ranking targets:**
- "construction company Mumbai"
- "construction firm Mumbai"
- "contractor Mumbai residential"
- "Mumbai high-rise construction"
- "Strong Built" (brand)
- "Skyway Group construction"
- Specific client + project queries (Lodha contractor, Hiranandani contractor, etc.)

**What success looks like:** 90+ Lighthouse SEO score on every page; rich result eligibility verified in Google Search Console; Open Graph preview renders correctly when the URL is shared on WhatsApp, LinkedIn, and Twitter/X; `site:strongbuilt.com` in Google shows all 14 pages with unique titles and descriptions.

---

## 2. Non-Negotiable Principles

1. **HTML must be present at initial load.** A React SPA that renders an empty `<div id="root">` and hydrates via JS has effectively zero SEO for most crawlers and breaks every social-media preview. This is the #1 problem to fix before anything else in this prompt matters.
2. **Every page has unique, hand-written `title`, `description`, `canonical`, and Open Graph tags.** No duplicates. No auto-generated filler.
3. **Every page has a single, descriptive `<h1>`.** The H1 is the human-readable version of the `<title>` — similar but not identical.
4. **Structured data on every page.** JSON-LD, not microdata. `Organization` + `WebSite` site-wide; page-specific schemas layered on top.
5. **No SEO dark patterns.** No keyword stuffing, no hidden text, no cloaking, no buying links, no AI-generated slop filler content.
6. **Local SEO is priority.** Strong Built is a Mumbai firm serving the MMR. NAP (Name, Address, Phone) must be consistent and present on every page.
7. **Performance is SEO.** Core Web Vitals directly affect rankings. LCP < 2.5s, INP < 200ms, CLS < 0.1 on mobile 4G. Non-negotiable.
8. **Semantic HTML beats ARIA.** Use `<nav>`, `<main>`, `<article>`, `<aside>`, `<header>`, `<footer>` correctly. Screen readers and crawlers both prefer semantic over aria-labeled soup.

---

## 3. Fix the SPA Rendering Problem First

This is the foundation. Do not proceed to meta tags or schemas until this is done — they only work if they're in the HTML when the crawler arrives.

### 3.1 The problem

Crawlers get different levels of JS rendering:
- **Googlebot** renders JS but with a delay and imperfectly — content rendering via `useEffect` or fetched post-mount may not be indexed.
- **Bingbot, Yandex, Baidu** render JS poorly.
- **Social media scrapers** (WhatsApp, Facebook, LinkedIn, Twitter/X, Slack) do NOT render JS at all. They read the initial HTML only. If your meta tags are injected client-side, link previews are broken.

### 3.2 The fix: build-time prerendering

Since Strong Built is a marketing site with static content (no per-user dynamic data on public pages), build-time **static site generation (SSG)** is the ideal solution. Every route gets a fully-rendered HTML file generated at build, served directly by Netlify's CDN, with React hydrating on top.

**Install and configure `vite-react-ssg`:**

```bash
npm install vite-react-ssg react-router-dom
```

Update `vite.config.js`:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    crittersOptions: {
      preload: 'swap',
      pruneSource: true,
    },
  },
});
```

Convert `src/main.jsx` to export the SSG entry:

```jsx
import { ViteReactSSG } from 'vite-react-ssg';
import { routes } from './routes';
import './styles/tokens.css';
import './styles/globals.css';

export const createRoot = ViteReactSSG({ routes });
```

In `src/routes.jsx`, define every page as a route with `path` — the SSG plugin crawls these and pre-renders each one:

```jsx
export const routes = [
  {
    path: '/',
    Component: () => import('./pages/Home'),
    entry: 'src/main.jsx',
  },
  { path: '/story', Component: () => import('./pages/Story') },
  { path: '/leadership', Component: () => import('./pages/Leadership') },
  { path: '/culture', Component: () => import('./pages/Culture') },
  { path: '/recognition', Component: () => import('./pages/Recognition') },
  { path: '/projects', Component: () => import('./pages/Projects') },
  { path: '/map', Component: () => import('./pages/Map') },
  { path: '/services', Component: () => import('./pages/Services') },
  { path: '/clients', Component: () => import('./pages/Clients') },
  { path: '/investors', Component: () => import('./pages/Investors') },
  { path: '/csr', Component: () => import('./pages/CSR') },
  { path: '/careers', Component: () => import('./pages/Careers') },
  { path: '/resources', Component: () => import('./pages/Resources') },
  { path: '/contact', Component: () => import('./pages/Contact') },
  { path: '*', Component: () => import('./pages/NotFound') },
];
```

Update `package.json` build script:

```json
"scripts": {
  "dev": "vite",
  "build": "vite-react-ssg build",
  "preview": "vite preview"
}
```

After this change, `npm run build` outputs a `dist/` folder with actual HTML files: `dist/index.html`, `dist/story/index.html`, `dist/leadership/index.html`, etc. Netlify serves these directly. Hydration happens transparently.

**Verify the fix:**

```bash
npm run build
curl https://strongbuiltofficial.netlify.app/story
# You should see rendered HTML with real content — H1, paragraphs, meta tags —
# NOT an empty <div id="root"></div>
```

### 3.3 Alternatives (if `vite-react-ssg` doesn't fit)

- **`react-snap`** — Puppeteer-based post-build crawler that saves HTML snapshots. Simpler to adopt but slower builds.
- **Migrate to Next.js or Remix** — bigger refactor but better long-term for a growing site.
- **Netlify's prerendering add-on** — serves prerendered HTML only to crawlers. Works, but mixed rendering paths are fragile.

**Default recommendation: `vite-react-ssg`.** Use the others only if there's a specific blocker.

---

## 4. Per-Page Metadata System

### 4.1 Install `react-helmet-async`

```bash
npm install react-helmet-async
```

Wrap the app root:

```jsx
// src/main.jsx (or App.jsx)
import { HelmetProvider } from 'react-helmet-async';

<HelmetProvider>
  <App />
</HelmetProvider>
```

### 4.2 Create `<SEO>` component

A single reusable component that every page renders at the top. Extract to `src/components/seo/SEO.jsx`:

```jsx
import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://strongbuilt.com'; // Replace with production domain when live
const DEFAULT_OG_IMAGE = `${SITE_URL}/og/default.jpg`;
const SITE_NAME = 'Strong Built';

export function SEO({
  title,
  description,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  noindex = false,
  keywords,
  schema, // JSON-LD object or array
}) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const canonicalUrl = canonical.startsWith('http') ? canonical : `${SITE_URL}${canonical}`;

  return (
    <Helmet>
      {/* Primary meta */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph — for WhatsApp, LinkedIn, Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(schema) ? schema : [schema])}
        </script>
      )}
    </Helmet>
  );
}
```

### 4.3 Per-page metadata specifications

Each page renders `<SEO />` as its first child. Use these exact values:

#### `/` — Home

```jsx
<SEO
  title="Premier Construction Company in Mumbai"
  description="Strong Built delivers premium residential, commercial, and institutional construction across Mumbai. 90+ buildings, 5.7M sq.ft delivered since 2014. ISO 9001·14001·45001 certified."
  canonical="/"
  keywords="construction company Mumbai, Mumbai contractor, high-rise construction Mumbai, residential construction Mumbai, Strong Built, Skyway Group"
/>
```

#### `/story` — Our Story

```jsx
<SEO
  title="Our Story — A Decade of Engineering Mumbai's Skyline"
  description="Since 2014, Strong Built has grown from a contractor into a premier Mumbai construction firm — 90+ buildings across the MMR, anchored by the 5S philosophy of strength, speed, safety, sustainability, and standards."
  canonical="/story"
/>
```

#### `/leadership` — Leadership

```jsx
<SEO
  title="Leadership — The People Behind Strong Built"
  description="Meet the leadership team steering Strong Built's residential, commercial, and institutional construction projects across Mumbai and the MMR."
  canonical="/leadership"
/>
```

#### `/culture` — Culture

```jsx
<SEO
  title="Culture — How We Build at Strong Built"
  description="Site discipline, craftsmanship, and safety-first culture. Explore the working principles that shape every Strong Built project in Mumbai."
  canonical="/culture"
/>
```

#### `/recognition` — Recognition

```jsx
<SEO
  title="Awards & Recognition — ISO Certified Mumbai Contractor"
  description="ISO 9001, 14001, and 45001 certified. Fastest Growing Firm 2021, Governor's Award 2022, Times Excellence 2023, ET Safety Practices 2024 — the recognition behind Strong Built's work."
  canonical="/recognition"
/>
```

#### `/projects` — Portfolio

```jsx
<SEO
  title="Projects — 90+ Buildings Delivered Across Mumbai"
  description="Explore Strong Built's portfolio: Monticello, Tree Top, Splendora, Luxaria, Iris, and more. Premium residential, luxury, and mixed-use construction across the Mumbai Metropolitan Region."
  canonical="/projects"
/>
```

#### `/map` — Project Map

```jsx
<SEO
  title="Project Map — Strong Built Across the MMR"
  description="See every Strong Built project on the map — residential towers, mixed-use developments, and institutional buildings across Mumbai, Thane, Pune, and beyond."
  canonical="/map"
/>
```

#### `/services` — Services

```jsx
<SEO
  title="Construction Services — Residential, Commercial, Institutional"
  description="End-to-end construction services in Mumbai: high-rise residential, Grade-A commercial, institutional turnkey, and in-house design & planning. 33+ completed projects."
  canonical="/services"
/>
```

#### `/clients` — Clients

```jsx
<SEO
  title="Clients — Trusted by Mumbai's Leading Developers"
  description="Strong Built is the chosen construction partner for Lodha, Hiranandani, Rustomjee, Mahindra Lifespaces, Ajmera, Ekta World, and Mumbai's top developers."
  canonical="/clients"
/>
```

#### `/investors` — Investors

```jsx
<SEO
  title="Investors — Strong Built & Skyway Group"
  description="Investor information for Strong Built, a Skyway Group company. A decade of disciplined growth in Mumbai's construction sector."
  canonical="/investors"
/>
```

#### `/csr` — CSR

```jsx
<SEO
  title="CSR — Building Beyond Buildings"
  description="Strong Built's community commitments: environmental stewardship, on-site worker welfare, and education initiatives across Mumbai."
  canonical="/csr"
/>
```

#### `/careers` — Careers

```jsx
<SEO
  title="Careers — Work With Mumbai's Premier Construction Firm"
  description="Join Strong Built's team of 25+ construction veterans. Open roles in engineering, project management, safety, and architecture across our Mumbai projects."
  canonical="/careers"
/>
```

#### `/resources` — Resources

```jsx
<SEO
  title="Resources — Construction Insights & Downloads"
  description="Construction guides, project case studies, and technical resources from Strong Built's engineering team."
  canonical="/resources"
/>
```

#### `/contact` — Contact

```jsx
<SEO
  title="Contact — Start a Project with Strong Built"
  description="Get in touch with Strong Built. Office at HDIL Kaledonia, Andheri East, Mumbai. Phone +91 96198 75081. Email sales@strongbuilt.in."
  canonical="/contact"
/>
```

### 4.4 Title & description rules

- **Titles:** 50–60 characters max (Google truncates at ~580px). Lead with the most important keyword. Include the brand at the end (`SEO` component handles this).
- **Descriptions:** 150–160 characters. Write as a compelling pitch, not keyword salad. Include one primary keyword naturally. End with specifics (numbers, certifications, client names) to build trust.
- **Never duplicate.** Each page's title and description must be unique across the site. Run a duplicate-check before shipping.
- **No pipe characters in descriptions** — they fragment in search snippets.

---

## 5. Open Graph Images

Every page needs a `1200×630px` OG image. Don't ship a single generic one for all pages — that makes every share look identical and reduces click-through.

### 5.1 Image specifications

- **Dimensions:** 1200×630px (aspect ratio 1.91:1).
- **Format:** JPG at 80% quality, under 1MB. WebP is not yet universally supported by OG scrapers — stick with JPG.
- **Safe zone:** keep key content within the inner 1080×540px area. Social platforms crop edges on different surfaces.
- **Text:** large, readable at thumbnail size. Minimum font size 48px.
- **Branding:** logo in one corner, dark navy background with copper accent, matches the site's visual language.

### 5.2 Per-page OG image plan

Create these in `/public/og/`:

- `og-default.jpg` — brand hero with "Strong Built — Engineering Legacies in Mumbai"
- `og-home.jpg` — hero architectural image overlaid with site tagline
- `og-story.jpg` — "A Decade of Engineering Mumbai's Skyline"
- `og-leadership.jpg` — "The People Behind Strong Built"
- `og-projects.jpg` — collage of signature projects
- `og-services.jpg` — "Residential · Commercial · Institutional"
- `og-recognition.jpg` — "ISO 9001 · 14001 · 45001 Certified"
- `og-careers.jpg` — "Work With Mumbai's Premier Construction Firm"
- `og-contact.jpg` — contact info styled
- Plus one per remaining page.

Pass the path to `<SEO ogImage={...}>` on each page. **Use absolute URLs** (e.g. `https://strongbuilt.com/og/og-story.jpg`) — relative URLs break on some scrapers.

### 5.3 Verification

Before launch, test every URL through:
- https://metatags.io
- https://www.opengraph.xyz
- https://cards-dev.twitter.com/validator (Twitter)
- https://www.linkedin.com/post-inspector/ (LinkedIn — important for B2B)
- WhatsApp: send the link to yourself, confirm preview renders.

---

## 6. Structured Data (JSON-LD Schema)

This is the single biggest underused SEO lever. Implemented correctly, it unlocks rich results in Google (star ratings, breadcrumbs, sitelinks, knowledge panel).

### 6.1 Site-wide schemas (inject on every page)

Create `src/components/seo/schemas.js`:

```js
const SITE_URL = 'https://strongbuilt.com';

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'LocalBusiness', 'GeneralContractor'],
  '@id': `${SITE_URL}/#organization`,
  name: 'Strong Built',
  alternateName: ['Strong Built Construction', 'Strongbuilt'],
  url: SITE_URL,
  logo: `${SITE_URL}/assets/Logo/Strongbuilt.png`,
  image: `${SITE_URL}/og/og-default.jpg`,
  description: 'Premier Mumbai construction firm delivering residential, commercial, and institutional buildings since 2014.',
  foundingDate: '2014',
  parentOrganization: {
    '@type': 'Organization',
    name: 'Skyway Group',
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: '901-B Wing, HDIL Kaledonia, Sahar Road',
    addressLocality: 'Andheri East',
    addressRegion: 'Maharashtra',
    postalCode: '400069',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 19.1136,  // Verify exact coordinates
    longitude: 72.8697,
  },
  telephone: ['+91-96198-75081', '+91-22-6123-2500'],
  email: 'sales@strongbuilt.in',
  areaServed: [
    { '@type': 'City', name: 'Mumbai' },
    { '@type': 'City', name: 'Thane' },
    { '@type': 'City', name: 'Pune' },
    { '@type': 'AdministrativeArea', name: 'Mumbai Metropolitan Region' },
  ],
  sameAs: [
    // Add verified social URLs once live
    // 'https://www.linkedin.com/company/strong-built',
    // 'https://www.instagram.com/strongbuilt',
  ],
  hasCredential: [
    { '@type': 'EducationalOccupationalCredential', name: 'ISO 9001' },
    { '@type': 'EducationalOccupationalCredential', name: 'ISO 14001' },
    { '@type': 'EducationalOccupationalCredential', name: 'ISO 45001' },
  ],
  award: [
    "Fastest Growing Firm '21",
    "Governor's Award '22",
    "Times Excellence '23",
    "ET Safety Practices '24",
  ],
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: 'Strong Built',
  publisher: { '@id': `${SITE_URL}/#organization` },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/projects?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export const breadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
  })),
});
```

Pass `schema={[organizationSchema, websiteSchema, breadcrumbSchema(...)]}` on every page.

### 6.2 Page-specific schemas

**Home:** add `organizationSchema + websiteSchema`. Enough — don't overload.

**Story:** add `AboutPage` schema:

```js
{
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  mainEntity: { '@id': `${SITE_URL}/#organization` },
  url: `${SITE_URL}/story`,
  name: 'Our Story — Strong Built',
}
```

**Leadership:** add a `Person` schema for each leader:

```js
{
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Full Name',
  jobTitle: 'Managing Director',
  worksFor: { '@id': `${SITE_URL}/#organization` },
  image: `${SITE_URL}/assets/leadership/name.jpg`,
}
```

**Services:** use `Service` schema for each of the four service areas:

```js
{
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Residential Construction',
  provider: { '@id': `${SITE_URL}/#organization` },
  areaServed: 'Mumbai Metropolitan Region',
  description: 'High-end villas, premium high-rises, and integrated townships built to the 5S standard.',
}
```

**Projects:** for each signature project, use `CreativeWork` or `Place`:

```js
{
  '@context': 'https://schema.org',
  '@type': 'Place',
  name: 'Monticello',
  description: 'Signature residential tower delivered 2019.',
  image: `${SITE_URL}/assets/Projects/monticello.jpg`,
  containedInPlace: { '@type': 'Place', name: 'Mumbai' },
  dateCompleted: '2019',
}
```

Wrap all projects in an `ItemList`:

```js
{
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: projects.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: { '@type': 'Place', name: p.name, image: p.image, ... },
  })),
}
```

**Careers:** use `JobPosting` schema if/when specific roles are listed. Google surfaces these in the Jobs results.

**Contact:** include `ContactPage` schema plus the `LocalBusiness` contact info (already in site-wide `organizationSchema`).

**Recognition:** each award is an `Award` — you can mention them in the `organizationSchema` `award` array (done above) and additionally call out each with a short schema block.

### 6.3 Breadcrumbs

Every non-home page gets `breadcrumbSchema`:

```js
// On /projects
breadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'Projects', url: '/projects' },
])

// On /story
breadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'About', url: '/story' },
  { name: 'Our Story', url: '/story' },
])
```

Also render them visually in the UI (above the page H1) — crawlers correlate JSON-LD with visible breadcrumbs.

### 6.4 Validation

After implementation, run every page through:
- https://search.google.com/test/rich-results
- https://validator.schema.org/

Fix every warning and error before shipping. Warnings are not optional — Google uses them as signals.

---

## 7. Technical SEO

### 7.1 `robots.txt`

Create `public/robots.txt`:

```
User-agent: *
Allow: /

# Block build artifacts if ever exposed
Disallow: /assets/maps/
Disallow: /*.json$

# Sitemap location
Sitemap: https://strongbuilt.com/sitemap.xml
```

### 7.2 `sitemap.xml`

Generate at build time using `vite-plugin-sitemap`:

```bash
npm install vite-plugin-sitemap --save-dev
```

```js
// vite.config.js
import sitemap from 'vite-plugin-sitemap';

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://strongbuilt.com',
      dynamicRoutes: [
        '/', '/story', '/leadership', '/culture', '/recognition',
        '/projects', '/map', '/services', '/clients', '/investors',
        '/csr', '/careers', '/resources', '/contact',
      ],
      changefreq: 'monthly',
      priority: 0.8,
      // Home gets higher priority
      exclude: [],
    }),
  ],
});
```

Generated output (`dist/sitemap.xml`):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://strongbuilt.com/</loc><priority>1.0</priority><changefreq>weekly</changefreq></url>
  <url><loc>https://strongbuilt.com/projects</loc><priority>0.9</priority></url>
  <!-- ...etc -->
</urlset>
```

### 7.3 Canonical URLs

Every page's `<SEO>` component already sets `<link rel="canonical">`. Rules:

- Always absolute URL (`https://strongbuilt.com/story`, not `/story`).
- Always lowercase.
- Always without trailing slash except for the root (`/`).
- Pick one: `strongbuilt.com` or `www.strongbuilt.com`. Stick with it. Configure Netlify to 301 the other variant.
- Canonical to the production domain, not the Netlify preview URL.

### 7.4 URL structure rules

- Lowercase only.
- Hyphens, not underscores, between words.
- No trailing slashes (except root).
- No `.html` extensions.
- No query parameters for canonical page access (reserve `?` for filters/search).
- Short, descriptive: `/projects/monticello`, not `/projects/project-monticello-2019-mumbai`.

### 7.5 404 page

Every site needs a real 404 page at a catch-all route that returns an HTTP 404 status.

Netlify `_redirects` file (in `public/`):

```
/*  /index.html  200
```

Doesn't return 404. Replace with:

```
# SPA fallback but proper 404 for missing pages
/*  /404.html  404
```

Combined with `vite-react-ssg`'s wildcard route, you get a real 404 page that crawlers understand.

### 7.6 HTTP headers (via Netlify `_headers`)

Create `public/_headers`:

```
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(self)

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: public, max-age=0, must-revalidate
```

Security headers are a soft ranking signal and a hard trust signal.

### 7.7 Redirect rules

Once migrated to the production domain, `_redirects`:

```
# Force HTTPS (Netlify does this by default, but explicit is better)
# Force primary host
https://www.strongbuilt.com/*  https://strongbuilt.com/:splat  301!

# Old Netlify URL
https://strongbuiltofficial.netlify.app/*  https://strongbuilt.com/:splat  301!

# Remove trailing slashes
/*/ /:splat 301!
```

---

## 8. Core Web Vitals (SEO-Critical Performance)

Google uses CWV as a ranking signal. Targets for mobile on slow 4G:

- **LCP (Largest Contentful Paint):** < 2.5s
- **INP (Interaction to Next Paint):** < 200ms
- **CLS (Cumulative Layout Shift):** < 0.1

### 8.1 LCP: hero image must load fast

- Hero image in `<picture>` with `loading="eager"`, `fetchpriority="high"`.
- Preload in HTML head:
  ```html
  <link rel="preload" as="image" href="/assets/hero.webp" type="image/webp" imagesrcset="/assets/hero-800.webp 800w, /assets/hero-1600.webp 1600w" imagesizes="100vw">
  ```
- Serve WebP with JPG fallback.
- Image dimensions explicit (`width`, `height`) to prevent CLS.
- Netlify Image CDN or a build-time optimizer (`vite-imagetools`) for responsive variants.

### 8.2 CLS: reserve space for everything

- Every `<img>`: `width`, `height`, `aspect-ratio` set.
- Custom fonts: `font-display: swap` + `<link rel="preload" as="font">` for the primary weight.
- Never inject content above the fold post-load (banners, cookie bars) without pre-reserved space.
- Don't animate properties that trigger layout.

### 8.3 INP: minimize main-thread work

- Code-split by route (React Router lazy loading).
- Defer non-critical scripts: analytics, chat widgets, marketing pixels all load post-interaction.
- Remove unused dependencies. Audit bundle size — total JS under 180kb gzipped for the home route.

### 8.4 Font loading

Put in `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" href="/fonts/fraunces-variable.woff2" as="font" type="font/woff2" crossorigin>
```

CSS:

```css
@font-face {
  font-family: 'Fraunces';
  src: url('/fonts/fraunces-variable.woff2') format('woff2');
  font-weight: 400 700;
  font-display: swap;
  font-style: normal;
}
```

**`font-display: swap`** is the critical line — without it, text is invisible until fonts load, killing LCP.

---

## 9. Content SEO

### 9.1 Heading structure rules (per page)

- Exactly one `<h1>` per page (the SEO title's human counterpart).
- Never skip levels: H1 → H2 → H3. Not H1 → H3.
- Headings describe their section honestly. Don't write `<h2>Services</h2>` over a contact form.
- Keywords naturally, not stuffed. If the H2 reads awkwardly, rewrite it.

### 9.2 Image alt text

Every content image needs descriptive `alt`. Rules:

- **Project images:** `alt="Monticello residential tower in Thane, completed 2019"` — describes the subject with context.
- **Decorative images:** `alt=""` (empty), so screen readers skip them.
- **Logo:** `alt="Strong Built"` (brand name, not "logo").
- **Client logos:** `alt="Lodha Group"` (brand name).
- Never `alt="image"`, `alt="IMG_4521.jpg"`, or missing `alt`.

### 9.3 Internal linking

Every page should link to related pages. Build cross-references:

- From `/services` → `/projects` ("See our work")
- From `/projects` → `/services` ("Learn about our process") and `/contact` ("Start a project")
- From `/recognition` → `/story` ("How we got here")
- From `/leadership` → `/careers` ("Join the team")
- From `/clients` → `/projects` ("Projects for these clients")

Use descriptive anchor text — not "click here", not "read more" alone. `Read our story → Strong Built since 2014` is better than `Read more`.

### 9.4 Link hygiene

- All external links: `rel="noopener"` (security).
- External partner links (client sites): `rel="noopener noreferrer"`.
- Untrusted links: `rel="nofollow noopener"`.
- Internal links: no rel attribute needed.
- No broken links, ever. Run a link crawler on every build.

### 9.5 Content quality signals

- Pages over 300 words typically rank better than thin pages. Current `/culture`, `/investors`, `/csr`, `/resources` pages may be thin — flesh them out with real content.
- Update the site every 60–90 days (new project, new award, new team member). Freshness is a ranking signal.
- Write for humans. If a paragraph only exists for keywords, delete it.

---

## 10. Local SEO (Mumbai)

This is where the real business leads come from. A perfectly SEO'd site that doesn't show up in Mumbai-local search results has failed.

### 10.1 NAP consistency

Name, Address, Phone must be **identical** everywhere:

- In the footer (visible).
- In the `organizationSchema` JSON-LD.
- On Google Business Profile.
- In any directory listings.

Exact format:

```
Strong Built
901-B Wing, HDIL Kaledonia
Sahar Road, Andheri East
Mumbai — 400069
Maharashtra, India
+91 96198 75081
```

### 10.2 Google Business Profile

Must be claimed and optimized:

- Business category: **General Contractor** (primary) + Construction Company + Civil Engineer (secondary).
- All photos uploaded (minimum 10): projects, site, team.
- Hours, services, description all filled.
- Regular posts (monthly minimum) with project updates.
- Respond to every review within 48 hours.
- Verify the business at the physical address.

### 10.3 Location-based content

Mention Mumbai and surrounding areas naturally throughout the site — **not stuffed**:

- "Mumbai's premier construction firm"
- "Projects across the Mumbai Metropolitan Region"
- "Thane, Pune, Nagpur, Alibaug — sites across Maharashtra"
- "Our office in Andheri East"

Consider future expansion: dedicated location pages (`/projects/mumbai`, `/projects/thane`, `/projects/pune`) if you want to rank for each area specifically. This is a longer-term play — flag it as a phase-2 initiative.

### 10.4 Local schema specifics

Already covered in `organizationSchema` (6.1) — the `@type: LocalBusiness` + `@type: GeneralContractor` combination tells Google this is a local trades business, not a generic corporate site. The `areaServed` and `geo` fields are what let it appear in Maps results and local pack.

---

## 11. Monitoring & Verification

### 11.1 Required accounts

- **Google Search Console** (submit sitemap, monitor coverage, fix errors).
- **Google Analytics 4** or **Plausible** (privacy-friendlier alternative).
- **Bing Webmaster Tools** (smaller traffic, but low effort).

### 11.2 Launch checklist

Before marking SEO work complete:

- [ ] Every page returns rendered HTML on `curl` (SSG verified).
- [ ] Every page has unique title and description (no duplicates).
- [ ] Every page has valid JSON-LD (Rich Results test passes).
- [ ] Every page has OG image that renders on WhatsApp, LinkedIn, Twitter.
- [ ] `sitemap.xml` accessible at `/sitemap.xml`, contains all 14 pages.
- [ ] `robots.txt` accessible at `/robots.txt`.
- [ ] Canonical URLs point to production domain.
- [ ] 404 page returns HTTP 404 (not 200).
- [ ] Every image has descriptive alt text.
- [ ] Every page's H1 is present, unique, descriptive.
- [ ] Lighthouse SEO score ≥ 95 on every page.
- [ ] Core Web Vitals pass on mobile for every page.
- [ ] Google Search Console property verified, sitemap submitted.
- [ ] Google Business Profile claimed and populated.
- [ ] Internal links audited — no broken links, descriptive anchor text.
- [ ] Schema validator returns zero errors, zero warnings on every page.
- [ ] Netlify custom domain configured, `www` → apex redirect working.
- [ ] HTTPS enforced, HSTS header set.

### 11.3 Ongoing hygiene (post-launch)

- **Weekly:** check GSC for new errors. Fix within 48 hours.
- **Monthly:** review CWV in GSC. Fix regressions.
- **Quarterly:** refresh content on at least 3 pages. Add new projects to portfolio. Update leadership bios if changed. Add new awards.
- **Annually:** full technical SEO audit. Screaming Frog crawl. Fix every issue it finds.

---

## 12. Accessibility (Overlaps with SEO)

Every accessibility improvement also helps SEO. Bake it in from the start:

- **Semantic HTML** — `<nav>`, `<main>`, `<article>`, `<aside>`, `<section>` over `<div>` soup.
- **Landmark roles** only when semantic HTML isn't expressive enough.
- **Keyboard navigation** — every interactive element reachable via Tab, operable via Enter/Space.
- **Focus indicators** — visible copper ring on every focusable element.
- **Color contrast** — text on background must meet WCAG AA (4.5:1 for body, 3:1 for large text). Run the palette through a contrast checker.
- **ARIA labels** only on elements that genuinely need them (icon buttons, custom widgets). Don't sprinkle `aria-label` on everything — incorrect ARIA is worse than none.
- **Skip-to-content link** at the top of every page, visible on keyboard focus.

---

## 13. Deliverables & Working Order

Work in this exact sequence. Each step depends on the prior.

1. **Implement `vite-react-ssg`** (Section 3). Verify HTML rendering on build.
2. **Install `react-helmet-async`** and build the `<SEO>` component (Section 4).
3. **Apply per-page `<SEO>`** to all 14 pages with the exact titles and descriptions from 4.3.
4. **Build and ship OG images** (Section 5).
5. **Add `organizationSchema` and `websiteSchema`** site-wide, then layer page-specific schemas (Section 6).
6. **Set up `robots.txt`, `sitemap.xml`, `_headers`, `_redirects`** (Section 7).
7. **Audit Core Web Vitals** — fix LCP, CLS, INP on every page (Section 8).
8. **Content pass** — verify H1s, alt text, internal links (Section 9).
9. **Configure Google Business Profile + NAP consistency** (Section 10).
10. **Set up Google Search Console**, submit sitemap, monitor first crawl (Section 11).

Do not skip steps. Do not reorder. The SSG fix (step 1) is the foundation — every subsequent step depends on it.

---

## 14. What Success Looks Like

90 days after launch:

- Google indexes all 14 pages (`site:strongbuilt.com` shows every page).
- Brand search "Strong Built" returns the site as result #1 with sitelinks.
- Local search "construction company Andheri East" returns the site in the local pack.
- WhatsApp / LinkedIn link previews render the correct image and title for every page.
- Lighthouse SEO score = 100 on every page.
- Core Web Vitals: green on every page in Search Console.
- Rich results eligibility confirmed for Organization, LocalBusiness, BreadcrumbList.

Begin with Section 3. Nothing else matters until the SPA renders real HTML.
