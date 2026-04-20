# joss.dev

Personal site built with [Astro](https://astro.build) and [Bun](https://bun.sh).

## Stack

| Tool | Role |
|------|------|
| Astro 4 | Static site framework, content collections, file-based routing |
| Bun | Package manager, script runner |
| TypeScript | Strict mode throughout |
| Roboto Condensed / Roboto | Typography via Google Fonts |

---

## Quick start

```bash
bun install          # install dependencies
bun dev              # dev server → http://localhost:4321
bun run build        # production build → dist/
bun run preview      # preview the production build
bun run new-post     # scaffold a new blog post
```

---

## Project structure

```
src/
├── content/
│   ├── config.ts              # Astro content collection schema
│   └── blog/
│       └── <slug>/
│           ├── index.md       # post content + frontmatter
│           └── assets/        # images for this post
├── layouts/
│   └── BaseLayout.astro       # nav, font loading, <slot />
├── pages/
│   ├── index.astro            # homepage
│   ├── resume.astro           # resume
│   ├── blog/
│   │   ├── index.astro        # post list (getCollection)
│   │   └── [slug].astro       # dynamic post route + prose renderer
│   └── projects/
│       └── index.astro        # projects grid
├── styles/
│   └── global.css             # design tokens, resets, shared utilities
scripts/
└── new-post.ts                # blog post scaffolding script
public/
└── favicon.svg
```

---

## Blog posts

Run the scaffolding script to create a new post:

```bash
bun run new-post
# → prompts for a title
# → creates src/content/blog/<slug>/index.md
# → creates src/content/blog/<slug>/assets/
```

Posts are created with `draft: true`. Set `draft: false` when ready to publish.

### Frontmatter schema

```yaml
---
title: "Post title"
date: 2025-01-01
description: "One-sentence summary shown in listings."
tags: ["Java", "AWS"]
draft: false
---
```

### Referencing assets

Images placed in `assets/` can be referenced relatively in markdown:

```markdown
![alt text](./assets/diagram.png)
```

---

## Design system — "Lamplit"

The visual theme is **Lamplit**: a park at night. Pure dark grey canvas, with
amber light that warms interactive elements when you hover over them. Everything
else stays quiet.

### Color palette

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#111111` | Page canvas |
| `--bg-subtle` | `#1a1a1a` | Nav, banners, raised surfaces |
| `--bg-muted` | `#222222` | Cards, code blocks |
| `--bg-hover` | `#1c1c1c` | Row/card background on hover |
| `--border` | `#2a2a2a` | Dividers, outlines |
| `--border-lt` | `#333333` | Lighter border on hover |
| `--fg` | `#e0e0e0` | Primary text |
| `--fg-muted` | `#888888` | Secondary text, descriptions |
| `--fg-faint` | `#505050` | Dates, labels, tertiary chrome |
| `--accent` | `#E8C547` | Amber — the only warm colour |
| `--accent-lt` | `#F5D96A` | Accent on primary button hover |
| `--accent-dk` | `#C4A32A` | Company names, muted accent uses |

### Typography

| Token | Value | Usage |
|-------|-------|-------|
| `--font-head` | Roboto Condensed | Headings, labels, nav, buttons |
| `--font-body` | Roboto | Body copy, descriptions |

Heading weight: **700**. Label weight: **600** with `letter-spacing: 0.18em; text-transform: uppercase`.

### Interaction — the Lamplit hover rules

All transitions use `--ease: 150ms cubic-bezier(0.4, 0, 0.2, 1)`.

There are three interaction patterns. Every interactive element on the site
uses exactly one of them.

#### 1. Row (blog posts, resume entries)

Used on: `<a>` or `<div>` elements that span the full content width.

| Property | Rest | Hover |
|----------|------|-------|
| Background | transparent | `--bg-hover` |
| Title colour | `--fg` | `--accent` |
| Arrow colour | `--fg-faint` | `--accent` |
| Arrow position | `translateX(0)` | `translateX(4px)` |

```css
.row { transition: background var(--ease); }
.row:hover { background: var(--bg-hover); }
.row:hover .title { color: var(--accent); }
.row:hover .arrow { color: var(--accent); transform: translateX(var(--arrow-slide)); }
.arrow { transition: color var(--ease), transform var(--ease); }
```

#### 2. Card (projects)

Used on: self-contained card elements that sit in a grid.

| Property | Rest | Hover |
|----------|------|-------|
| Background | `--bg-subtle` | `--bg-hover` |
| Border | transparent | `rgba(232,197,71,0.25)` |
| Title colour | `--fg` | `--accent` |
| Link arrow | `translateX(0)` | `translateX(4px)` |

```css
.card { transition: background var(--ease), border-color var(--ease); }
.card:hover { background: var(--bg-hover); border-color: rgba(232,197,71,0.25); }
.card:hover .name { color: var(--accent); }
.card:hover .arrow { transform: translateX(var(--arrow-slide)); }
```

#### 3. Link

Used on: nav items, inline text links, standalone CTAs.

| Property | Rest | Hover |
|----------|------|-------|
| Colour | `--fg-muted` (nav) / inherited | `--accent` |

```css
a { transition: color var(--ease); }
a:hover { color: var(--accent); }
```

#### What not to do

- No `box-shadow` on hover — too heavy for a dark theme.
- No `scale()` transforms — too playful.
- No colour changes outside of the amber accent — don't introduce new hues on hover.
- Don't mix patterns — a row is a row, a card is a card.

### Shared utilities (global.css)

| Class | Description |
|-------|-------------|
| `.fade-up` | Entrance: `opacity 0→1, translateY 10px→0`, 350ms |
| `.fade-up-delay` | Same with 80ms delay — use on content below the banner |
| `.page-banner` | Dark banner strip at top of inner pages |
| `.page-body` | Centered content container, max-width 860px |
| `.sec-label` | Uppercase section heading label |
| `.tag` | Amber-tinted tag pill |
| `.btn-gold` | Primary amber button |
| `.btn-ghost` | Ghost button, warms to amber on hover |

---

## Attributions

The background grid pattern (`public/bg-pattern.svg`) uses icon paths from
[Font Awesome Free 6.7.2](https://fontawesome.com) by Fonticons, Inc., used under the
[CC BY 4.0 License](https://fontawesome.com/license/free).
Icons used: `beer-mug-empty`, `person-running`, `mug-hot`, `cloud` (all solid variant).

---

## Deployment

```bash
bun run build   # outputs static files to dist/
```

Deploy `dist/` to any static host. For Vercel:

```json
{
  "installCommand": "bun install",
  "buildCommand": "bun run build",
  "outputDirectory": "dist"
}
```
