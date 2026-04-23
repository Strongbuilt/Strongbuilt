# Strong Built — Theme & Typography Consistency Prompt

> Paste this entire file into Cursor / Windsurf / Claude Code as a single prompt. It is designed for the React + Vite + Tailwind codebase deployed at `strongbuiltofficial.netlify.app`. Goal: every page speaks the same visual language. No orphan font sizes, no one-off colors, no ad-hoc spacing.

---

## 1. Project Context

You are working on **Strong Built**, a multi-page React site for a Mumbai-based construction firm. The current pages are:

- `/` — Home
- `/story` — Our Story
- `/leadership` — Leadership
- `/culture` — Culture
- `/recognition` — Recognition
- `/projects` — Portfolio
- `/map` — Project Map
- `/services` — Services
- `/clients` — Clients
- `/investors` — Investors
- `/csr` — CSR
- `/careers` — Careers
- `/resources` — Resources
- `/contact` — Contact Us

**The problem:** heading sizes, text colors, spacing, and button styles drift between pages because styles were written inline and ad-hoc. One page's H2 is `text-4xl`, another page's is `text-[2.75rem]`, a third uses `text-5xl font-bold`. This breaks the premium feel the brand is aiming for.

**Your job:** establish a single source of truth for **typography, color, spacing, radii, and shadows**, then refactor every page to consume that source. Zero visual regressions — the site should look like a more *disciplined* version of what's there now, not a redesign.

---

## 2. Non-Negotiable Principles

1. **Tokens, not magic numbers.** No `text-[27px]`, no `#b97435`, no `mt-[18px]`. If a value isn't in the token system, either extend the token system or don't use it.
2. **Semantic names, not literal ones.** Call it `text-primary`, not `text-navy-900`. Call it `bg-surface`, not `bg-white`. This lets you refine the palette later without chasing 400 usages.
3. **Fluid typography by default.** All heading sizes use `clamp()` so they scale smoothly from 375px to 1920px. Never hard-switch at a breakpoint for font size.
4. **One H1 per page.** Every page has exactly one `<h1>` at the top — the page title. Hero H1 on home, section title elsewhere.
5. **Hierarchy is visual, not just markup.** A page with an H1, two H2s, and six H3s should read as a clear three-level structure with no ambiguity about which level any given heading belongs to.
6. **Line length caps.** Body paragraphs never exceed `75ch`. Long paragraphs get a `max-w-prose` container.
7. **Respect the existing brand.** Clean white backgrounds, deep navy text, copper accents. Do not introduce new hues, new fonts, or new shadow styles. Lock the palette; don't expand it.

---

## 3. Design Token Foundation

Implement tokens in **two places**:

1. **CSS variables** in `src/styles/tokens.css` — the source of truth, queryable from anywhere.
2. **Tailwind config** (`tailwind.config.js`) — consumes the CSS variables so Tailwind utilities (`text-primary`, `bg-surface`, etc.) just work.

### 3.1 `src/styles/tokens.css`

```css
:root {
  /* ---------- Color: Surface ---------- */
  --color-surface:           #FFFFFF;        /* primary page background */
  --color-surface-warm:      #FAFAF7;        /* section alt background, warm paper */
  --color-surface-sunken:    #F3F1EC;        /* cards on warm, or deeper alt sections */
  --color-surface-inverse:   #0B1A2B;        /* dark sections (footer, hero alt) */

  /* ---------- Color: Text ---------- */
  --color-text-primary:      #0B1A2B;        /* all H1-H3, key body */
  --color-text-secondary:    #4A5A6E;        /* body paragraphs, captions */
  --color-text-tertiary:     #8A94A3;        /* metadata, timestamps, eyebrows */
  --color-text-inverse:      #FAFAF7;        /* text on dark surfaces */
  --color-text-muted:        #B8BFC9;        /* disabled, placeholder */

  /* ---------- Color: Brand Accent (Copper) ---------- */
  --color-accent:            #B87333;        /* primary accent — CTAs, links, highlights */
  --color-accent-hover:      #C88545;        /* hover state */
  --color-accent-pressed:    #A05F26;        /* active/pressed state */
  --color-accent-soft:       #F3E4D3;        /* tint for backgrounds, pills */
  --color-accent-contrast:   #FFFFFF;        /* text on copper buttons */

  /* ---------- Color: Border ---------- */
  --color-border:            #E6E2DA;        /* default border, warm stone */
  --color-border-strong:     #C9C2B4;        /* emphasized border */
  --color-border-subtle:     #EFEDE7;        /* very quiet dividers */
  --color-border-inverse:    rgba(255,255,255,0.12); /* borders on dark surface */

  /* ---------- Color: Status ---------- */
  --color-success:           #2F7D5C;
  --color-warning:           #B78A2E;
  --color-error:             #B24242;
  --color-info:              #3C6A8F;

  /* ---------- Typography: Family ---------- */
  --font-display:            'Fraunces', 'Playfair Display', Georgia, serif;
  --font-body:               'Inter', 'Helvetica Neue', system-ui, sans-serif;
  --font-mono:               'JetBrains Mono', ui-monospace, monospace;

  /* ---------- Typography: Size (fluid with clamp) ---------- */
  --text-display-xl:         clamp(2.75rem, 4vw + 1.25rem, 5.5rem);   /* 44 → 88px, hero H1 */
  --text-display-lg:         clamp(2.25rem, 3vw + 1rem, 4.25rem);     /* 36 → 68px, page H1 */
  --text-display-md:         clamp(1.875rem, 2vw + 1rem, 3rem);       /* 30 → 48px, section H2 */
  --text-h1:                 clamp(1.75rem, 2vw + 1rem, 2.75rem);     /* 28 → 44px */
  --text-h2:                 clamp(1.5rem, 1.5vw + 0.75rem, 2.25rem); /* 24 → 36px */
  --text-h3:                 clamp(1.25rem, 1vw + 0.75rem, 1.75rem);  /* 20 → 28px */
  --text-h4:                 clamp(1.125rem, 0.5vw + 0.75rem, 1.375rem); /* 18 → 22px */
  --text-body-lg:            1.125rem;                                 /* 18px */
  --text-body:               1rem;                                     /* 16px */
  --text-body-sm:            0.9375rem;                                /* 15px */
  --text-caption:            0.875rem;                                 /* 14px */
  --text-micro:              0.75rem;                                  /* 12px */
  --text-eyebrow:            0.75rem;                                  /* 12px uppercase tracked */

  /* ---------- Typography: Line Height ---------- */
  --leading-display:         1.05;     /* display-xl/lg: tight, punchy */
  --leading-tight:           1.15;     /* display-md, h1-h2 */
  --leading-snug:            1.3;      /* h3-h4 */
  --leading-body:            1.6;      /* body text, default */
  --leading-relaxed:         1.75;     /* long-form prose */

  /* ---------- Typography: Letter Spacing ---------- */
  --tracking-display:        -0.02em;  /* tighten display sizes */
  --tracking-heading:        -0.01em;  /* slight tighten on headings */
  --tracking-normal:         0;
  --tracking-eyebrow:        0.12em;   /* wide tracking on uppercase eyebrows */

  /* ---------- Typography: Weight ---------- */
  --weight-regular:          400;
  --weight-medium:           500;
  --weight-semibold:         600;
  --weight-bold:             700;

  /* ---------- Spacing Scale (4px base) ---------- */
  --space-0:    0;
  --space-1:    0.25rem;   /* 4px */
  --space-2:    0.5rem;    /* 8px */
  --space-3:    0.75rem;   /* 12px */
  --space-4:    1rem;      /* 16px */
  --space-5:    1.5rem;    /* 24px */
  --space-6:    2rem;      /* 32px */
  --space-7:    3rem;      /* 48px */
  --space-8:    4rem;      /* 64px */
  --space-9:    6rem;      /* 96px */
  --space-10:   8rem;      /* 128px */
  --space-11:   12rem;     /* 192px */
  --space-12:   16rem;     /* 256px */

  /* ---------- Section Padding (vertical rhythm) ---------- */
  --section-y-sm: clamp(3rem, 6vw, 5rem);    /* 48 → 80px */
  --section-y-md: clamp(4rem, 8vw, 7rem);    /* 64 → 112px */
  --section-y-lg: clamp(5rem, 10vw, 9rem);   /* 80 → 144px */

  /* ---------- Container widths ---------- */
  --container-sm:  640px;
  --container-md:  768px;
  --container-lg:  1024px;
  --container-xl:  1280px;
  --container-2xl: 1440px;
  --container-prose: 68ch;                    /* long-form text cap */

  /* ---------- Radii ---------- */
  --radius-none:   0;
  --radius-sm:     4px;
  --radius-md:     8px;
  --radius-lg:     12px;
  --radius-xl:     16px;
  --radius-2xl:    24px;
  --radius-full:   9999px;

  /* ---------- Shadows (warm-tinted, soft) ---------- */
  --shadow-xs:   0 1px 2px rgba(11, 26, 43, 0.04);
  --shadow-sm:   0 2px 8px rgba(11, 26, 43, 0.06);
  --shadow-md:   0 8px 24px rgba(11, 26, 43, 0.08);
  --shadow-lg:   0 16px 40px rgba(11, 26, 43, 0.10);
  --shadow-xl:   0 24px 64px rgba(11, 26, 43, 0.12);
  --shadow-ring: 0 0 0 2px var(--color-accent); /* focus ring */

  /* ---------- Z-index ---------- */
  --z-base:      0;
  --z-raised:    10;
  --z-sticky:    20;
  --z-overlay:   30;
  --z-modal:     40;
  --z-toast:     50;
  --z-top:       99;

  /* ---------- Motion (reference only — full motion lives in animation prompt) ---------- */
  --ease-out:    cubic-bezier(0.22, 1, 0.36, 1);
  --duration-fast:   0.2s;
  --duration-base:   0.35s;
  --duration-slow:   0.6s;
}
```

### 3.2 `tailwind.config.js`

Consume the CSS variables so Tailwind utilities map to the tokens. This is the critical bridge — without it, developers will still reach for `text-gray-700` instead of `text-secondary`.

```js
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface:         'var(--color-surface)',
        'surface-warm':  'var(--color-surface-warm)',
        'surface-sunken':'var(--color-surface-sunken)',
        'surface-inverse':'var(--color-surface-inverse)',

        primary:         'var(--color-text-primary)',
        secondary:       'var(--color-text-secondary)',
        tertiary:        'var(--color-text-tertiary)',
        inverse:         'var(--color-text-inverse)',
        muted:           'var(--color-text-muted)',

        accent: {
          DEFAULT:  'var(--color-accent)',
          hover:    'var(--color-accent-hover)',
          pressed:  'var(--color-accent-pressed)',
          soft:     'var(--color-accent-soft)',
          contrast: 'var(--color-accent-contrast)',
        },

        border: {
          DEFAULT: 'var(--color-border)',
          strong:  'var(--color-border-strong)',
          subtle:  'var(--color-border-subtle)',
          inverse: 'var(--color-border-inverse)',
        },

        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error:   'var(--color-error)',
        info:    'var(--color-info)',
      },
      fontFamily: {
        display: 'var(--font-display)'.split(','),
        body:    'var(--font-body)'.split(','),
        mono:    'var(--font-mono)'.split(','),
      },
      fontSize: {
        'display-xl': ['var(--text-display-xl)', { lineHeight: 'var(--leading-display)', letterSpacing: 'var(--tracking-display)' }],
        'display-lg': ['var(--text-display-lg)', { lineHeight: 'var(--leading-display)', letterSpacing: 'var(--tracking-display)' }],
        'display-md': ['var(--text-display-md)', { lineHeight: 'var(--leading-tight)',   letterSpacing: 'var(--tracking-display)' }],
        h1:           ['var(--text-h1)',         { lineHeight: 'var(--leading-tight)',   letterSpacing: 'var(--tracking-heading)' }],
        h2:           ['var(--text-h2)',         { lineHeight: 'var(--leading-tight)',   letterSpacing: 'var(--tracking-heading)' }],
        h3:           ['var(--text-h3)',         { lineHeight: 'var(--leading-snug)',    letterSpacing: 'var(--tracking-heading)' }],
        h4:           ['var(--text-h4)',         { lineHeight: 'var(--leading-snug)',    letterSpacing: 'var(--tracking-normal)' }],
        'body-lg':    ['var(--text-body-lg)',    { lineHeight: 'var(--leading-body)' }],
        body:         ['var(--text-body)',       { lineHeight: 'var(--leading-body)' }],
        'body-sm':    ['var(--text-body-sm)',    { lineHeight: 'var(--leading-body)' }],
        caption:      ['var(--text-caption)',    { lineHeight: 'var(--leading-snug)' }],
        micro:        ['var(--text-micro)',      { lineHeight: 'var(--leading-snug)' }],
        eyebrow:      ['var(--text-eyebrow)',    { lineHeight: 1, letterSpacing: 'var(--tracking-eyebrow)' }],
      },
      spacing: {
        'section-sm': 'var(--section-y-sm)',
        'section-md': 'var(--section-y-md)',
        'section-lg': 'var(--section-y-lg)',
      },
      maxWidth: {
        container:       'var(--container-xl)',
        'container-2xl': 'var(--container-2xl)',
        prose:           'var(--container-prose)',
      },
      borderRadius: {
        sm:   'var(--radius-sm)',
        md:   'var(--radius-md)',
        lg:   'var(--radius-lg)',
        xl:   'var(--radius-xl)',
        '2xl':'var(--radius-2xl)',
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
      },
    },
  },
};
```

---

## 4. Typography Usage Rules

These rules dictate **exactly which token to use when.** No improvisation.

### 4.1 Heading hierarchy (semantic + visual)

| Element                         | Class          | Use for                                        |
|---------------------------------|----------------|------------------------------------------------|
| Hero H1 (home only)             | `text-display-xl font-display` | Landing hero headline          |
| Page H1 (all other pages)       | `text-display-lg font-display` | Primary page title             |
| Section H2                      | `text-display-md font-display` | Major section headlines        |
| Subsection H2 (nested)          | `text-h1 font-display`         | H2s inside a section            |
| H3                              | `text-h2 font-display`         | Card titles, sub-sections       |
| H4                              | `text-h3 font-body font-semibold` | Small block headings         |
| H5 / H6                         | `text-h4 font-body font-semibold` | Rarely needed                |

**Default color for all headings: `text-primary`.** Only change it when the heading sits on a dark surface (`text-inverse`) or for a specific emphasis use (`text-accent` on a single key word — never the whole heading).

### 4.2 Body text

| Element        | Class                                           | Use for                              |
|----------------|-------------------------------------------------|--------------------------------------|
| Lead paragraph | `text-body-lg text-secondary max-w-prose`       | Opening paragraph of a page/section  |
| Body           | `text-body text-secondary max-w-prose`          | Default paragraph                    |
| Small body     | `text-body-sm text-secondary`                   | Card descriptions, compact contexts  |
| Caption        | `text-caption text-tertiary`                    | Metadata, image captions, timestamps |
| Micro          | `text-micro text-tertiary`                      | Legal text, footnotes                |
| Eyebrow        | `text-eyebrow uppercase tracking-[0.12em] text-accent font-medium` | "WHO WE ARE", "OUR FOUNDATION" labels |

**Rule:** body text defaults to `text-secondary`. Reserve `text-primary` on body for a specific sentence that needs emphasis inside a paragraph (rare — usually emphasis belongs in a heading anyway).

### 4.3 Font weight rules

- Display/serif headings: weight `400` or `500`. **Never bold serif headings** — the face was designed to hold weight at regular; bolding makes it heavy and dated.
- Sans body: `400` default, `500` for emphasis, `600` for buttons/nav, `700` only for micro-UI labels where contrast is needed.
- Eyebrows: `500` only.

### 4.4 Line length

- Body paragraphs: `max-w-prose` (68ch) always. Never let a paragraph run across a 1400px viewport.
- Display headings: `max-w-[16ch]` to `max-w-[24ch]` — big type with short line length reads best.
- Card body: `max-w-[32ch]` or container-width, whichever is smaller.

### 4.5 Forbidden patterns

- `text-4xl`, `text-5xl`, `text-[2.75rem]`, `text-[44px]` — **any raw size is forbidden.** Use the semantic token.
- Inline `style={{ fontSize: '...' }}` — forbidden.
- Mixing serif and sans inside the same heading.
- Underline for emphasis (reserve for links).
- All-caps on anything longer than 6 words — it becomes unreadable.
- Italic on serif display type — the italic cut is for accents, not long phrases.

---

## 5. Color Usage Rules

### 5.1 Surface pairing

- White (`bg-surface`) is the default page background.
- Warm off-white (`bg-surface-warm`) for every other section, to create vertical rhythm.
- Sunken (`bg-surface-sunken`) for cards sitting on warm, or for the deepest layer.
- Inverse (`bg-surface-inverse`) only for footer, dark hero variants, and testimonial/CTA blocks — never more than 2 per page.

**Rhythm pattern (for any page with 6+ sections):** surface → warm → surface → warm → surface → inverse (footer). Predictable alternation reads as considered.

### 5.2 Accent usage (copper)

Copper is **precious.** Treat it like gold leaf.

**Use copper for:**
- Primary CTAs (filled `bg-accent text-accent-contrast`).
- Active nav state.
- Link hover underlines.
- One or two highlight words per section (never a whole heading).
- Numbered badges on cards (01, 02…).
- Progress bars, "Live" dots, status indicators.
- Focus rings.

**Do not use copper for:**
- Body text (kills readability).
- Entire headings.
- Large background fills.
- Multiple elements competing in the same viewport.

**Rule of thumb:** in any given viewport, there should be no more than 2–3 copper elements visible at once. If there are more, demote some to `text-primary` or `text-secondary`.

### 5.3 Text color pairings

| Surface              | Primary text       | Secondary text       | Accent       |
|----------------------|--------------------|----------------------|--------------|
| `bg-surface`         | `text-primary`     | `text-secondary`     | `text-accent`|
| `bg-surface-warm`    | `text-primary`     | `text-secondary`     | `text-accent`|
| `bg-surface-sunken`  | `text-primary`     | `text-secondary`     | `text-accent`|
| `bg-surface-inverse` | `text-inverse`     | `text-muted` (with care) | `text-accent` |

### 5.4 Forbidden color patterns

- Raw hex values anywhere in JSX/CSS. `#0B1A2B` in source → replace with token.
- Tailwind's default gray scale (`text-gray-700`, `bg-gray-100`). Replace with `text-secondary` / `bg-surface-warm`.
- Transparency on text (`text-primary/60`). If you need a softer text, use the next step down (`text-secondary`, `text-tertiary`).
- Gradient backgrounds on text. Keep the material-world construction tone solid.
- More than four distinct colors in a single component (surface + primary text + secondary text + one accent = max).

---

## 6. Spacing & Layout Rules

### 6.1 The 4px grid

All spacing is a multiple of `4px`. Use the `--space-*` tokens. **No arbitrary values.**

### 6.2 Section vertical padding

Every top-level section on every page uses one of three padding tokens:
- `py-section-sm` — dense sections (client logos, footer-adjacent CTA).
- `py-section-md` — default for most sections.
- `py-section-lg` — hero, major feature sections.

Don't mix these within a page arbitrarily — establish one rhythm per page and stick with it.

### 6.3 Container widths

All sections use one of these container widths, applied via a wrapping `div`:

```jsx
<section className="py-section-md bg-surface-warm">
  <div className="max-w-container mx-auto px-4 md:px-8">
    {/* content */}
  </div>
</section>
```

- `max-w-container` (1280px) — default.
- `max-w-container-2xl` (1440px) — for media-heavy sections (project galleries).
- `max-w-prose` — for long-form reading content (story, CSR, culture pages).

Horizontal page padding: `px-4` on mobile, `px-8` on md, `px-12` on lg, `px-16` on xl. Never less than `px-4` — content touching the edge on mobile looks amateur.

### 6.4 Content gaps

- Between a heading and its body paragraph: `mt-4` (16px).
- Between eyebrow and heading: `mt-0` on heading, `mb-3` on eyebrow (12px).
- Between body paragraphs: `mt-4` (16px) or use `space-y-4` on parent.
- Between a section's header block and the content below: `mt-10` to `mt-16` depending on section weight.
- Between grid/flex items (cards, pills): `gap-6` (24px) default, `gap-8` (32px) for larger cards.

---

## 7. Component Consistency Rules

These are the **five components** that appear on every page and most often drift. Lock them first.

### 7.1 Button

Three variants. No others exist. If you need a fourth, you're wrong — refine one of these.

```jsx
// Primary: filled copper — for the single most important action per viewport
<button className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-accent text-accent-contrast text-body font-semibold hover:bg-accent-hover active:bg-accent-pressed transition-colors duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2">
  Primary action
</button>

// Secondary: outlined — for adjacent supporting actions
<button className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-border-strong text-primary text-body font-semibold hover:bg-surface-warm active:bg-surface-sunken transition-colors duration-base focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2">
  Secondary action
</button>

// Ghost / text: underline on hover — for tertiary, inline actions
<button className="inline-flex items-center gap-1 text-body font-semibold text-accent hover:text-accent-hover transition-colors duration-base group">
  Read more
  <span className="transition-transform duration-base group-hover:translate-x-1">→</span>
</button>
```

Extract these into `<Button variant="primary|secondary|ghost">` in `src/components/ui/Button.jsx`. Nothing else uses hand-rolled button classes.

### 7.2 Eyebrow label

Every section with a heading gets an eyebrow above it. Consistency of this single element does 30% of the visual work.

```jsx
<span className="text-eyebrow uppercase tracking-[0.12em] text-accent font-medium">
  Who We Are
</span>
```

Extract to `<Eyebrow>{children}</Eyebrow>`.

### 7.3 Section header block

The eyebrow + H2 + lead paragraph combination repeats 30+ times across the site. Extract it:

```jsx
<SectionHeader
  eyebrow="Our Foundation"
  title="The 5S Philosophy"
  lead="The five pillars of operational excellence — non-negotiable, top to bottom."
/>
```

Internal structure is fixed: eyebrow (margin bottom 3), H2 (`text-display-md font-display text-primary`), lead paragraph (`text-body-lg text-secondary max-w-prose` with margin top 4).

### 7.4 Card

One card primitive. Variations by props, not by rewriting.

```jsx
<article className="group relative overflow-hidden rounded-lg bg-surface border border-border shadow-sm hover:shadow-md transition-shadow duration-base">
  {/* image wrapper with aspect-ratio */}
  {/* body with consistent padding: p-5 md:p-6 */}
  {/* eyebrow + title + optional description */}
</article>
```

Extract to `<Card>` with composable subcomponents (`Card.Image`, `Card.Body`, `Card.Title`, `Card.Meta`). Every card on the site uses this — project cards, service cards, leadership profile cards, recognition cards.

### 7.5 Pill / tag

For industry honors, project categories, tags.

```jsx
<span className="inline-flex items-center px-3 py-1 rounded-full border border-border text-caption font-medium text-secondary bg-surface hover:border-accent hover:text-accent transition-colors duration-base">
  ISO 9001
</span>
```

Extract to `<Pill>{children}</Pill>` with an optional `variant="solid"` for filled copper pills.

---

## 8. Per-Page Audit & Refactor Plan

Work through pages in this order. Each page is **one commit** and must be fully refactored (all headings, colors, spacing, components) before moving on.

### Phase 1 — Foundation (before touching any page)
1. Create `src/styles/tokens.css` and import it in `src/main.jsx` before any other CSS.
2. Update `tailwind.config.js` per Section 3.2.
3. Create `src/components/ui/` and implement `Button`, `Eyebrow`, `SectionHeader`, `Card`, `Pill`.
4. Verify Tailwind builds clean with no warnings about unknown classes.

### Phase 2 — Global layout (runs on every page)
5. `components/Navbar` — refactor to tokens.
6. `components/Footer` — refactor to tokens.
7. `layouts/PageLayout` (if not existing, create it) — applies default `min-h-screen bg-surface text-primary font-body` to every page.

### Phase 3 — Pages (in this exact order)
8. `/contact` — smallest surface area, best for catching token gaps early.
9. `/recognition` — mostly pills and cards, tests those primitives.
10. `/services` — grid of cards.
11. `/clients` — logo grid.
12. `/leadership` — profile cards.
13. `/culture` — text-heavy.
14. `/story` — text-heavy long-form, tests prose width.
15. `/csr` — text + imagery.
16. `/investors` — mixed.
17. `/careers` — mixed + forms.
18. `/resources` — mixed.
19. `/projects` (portfolio) — heaviest media page.
20. `/map` — custom component, audit separately.
21. `/` (home) — **last**, because it uses every pattern. If anything's inconsistent, it'll show here first.

### 8.1 Per-page audit checklist

For each page, verify before committing:

- [ ] Exactly one `<h1>`.
- [ ] Every heading uses a token class, not a raw size.
- [ ] Every color is a token (no hex, no Tailwind default grays).
- [ ] Every margin/padding is a token-scale value.
- [ ] All buttons use the `<Button>` component.
- [ ] All eyebrow labels use `<Eyebrow>`.
- [ ] All section headers use `<SectionHeader>`.
- [ ] All cards use `<Card>`.
- [ ] Section rhythm alternates `surface` / `surface-warm`.
- [ ] No paragraph wider than `max-w-prose`.
- [ ] Page renders identically at 375px, 768px, 1280px, 1920px — no size hops, no overflow.
- [ ] Focus ring visible on every interactive element via keyboard Tab.

---

## 9. Enforcement

Prevent regressions from day one:

### 9.1 ESLint rule (add to `.eslintrc`)

Ban raw Tailwind arbitrary values for colors and font sizes:

```js
'no-restricted-syntax': [
  'error',
  {
    selector: "Literal[value=/(text|bg|border)-\\[#/]",
    message: 'Use design tokens, not hex values in arbitrary Tailwind classes.',
  },
  {
    selector: "Literal[value=/text-\\[\\d+px\\]/]",
    message: 'Use a font-size token (text-h1, text-body, etc.), not raw px values.',
  },
]
```

### 9.2 Stylelint (for any CSS files)

Install `stylelint-declaration-strict-value` and enforce tokens:

```json
"plugins": ["stylelint-declaration-strict-value"],
"rules": {
  "scale-unlimited/declaration-strict-value": [
    ["/color$/", "font-size", "font-family"],
    { "ignoreValues": ["transparent", "currentColor", "inherit"] }
  ]
}
```

### 9.3 Code review checklist (add to PR template)

- [ ] No raw hex colors introduced.
- [ ] No raw font sizes introduced.
- [ ] Any new component uses existing primitives where possible.
- [ ] If a new token was needed, it was added to `tokens.css` and `tailwind.config.js`.

---

## 10. What Success Looks Like

When this is done:

- Opening any two pages side-by-side, headings are the same size for the same semantic level. No exceptions.
- Search the codebase for `text-[`, `bg-[`, `#` — only matches are in `tokens.css`.
- A new page can be built in under an hour using only existing primitives — no new styles needed.
- Designers reviewing the site say "it feels consistent now" without being able to articulate what changed. That's the goal: invisible, inevitable, disciplined.

**Start with Phase 1 (Foundation). Do not skip to refactoring pages before the token system is in place and verified.**
