# social-preview-cli

> Developer-first CLI and Node.js library to generate high-resolution social preview cards (OG Images) for GitHub, X (Twitter), LinkedIn, and technical blogs. Pure SVG & Rust-backed native PNG rendering.

[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg)](https://opensource.org/licenses/MIT)
[![Node.js: >=18.0.0](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-black.svg)](https://nodejs.org)
[![Engine: Resvg Rust](https://img.shields.io/badge/Engine-Resvg%20(Rust)-black.svg)](https://github.com/RazrFalcon/resvg)
[![Powered by PostReady](https://img.shields.io/badge/Powered%20by-PostReady.org-black.svg)](https://postready.org)

`social-preview-cli` creates clean, modern, typography-focused social cards without running headless Chromium, canvas bloat, or cloud API fees. It compiles mathematical SVG layouts and renders pixel-perfect 1200x630 PNG images in milliseconds using the Rust-backed `@resvg/resvg-js` engine.

Part of the **[PostReady.org](https://postready.org)** open-source content repurposing toolkit.

---

## Highlights

- ⚡ **Ultra Fast & Lightweight:** Renders production-grade 1200x630 PNGs in under 50ms without launching a browser.
- 📐 **Social Dimension Presets:** Built-in aspect ratios for Open Graph (`1200x630`), Twitter Summary Card (`1200x600`), GitHub Banner (`1280x640`), and Square (`1080x1080`).
- 🎨 **Minimalist Themes:** Handcrafted palettes designed for developers: `dark`, `light`, `terminal` (phosphor green), and `gold`.
- 🔤 **Smart Typography Wrapping:** Automatically breaks long titles into balanced, readable lines with author signatures and tag pills.
- 📦 **Dual Mode:** Use as an interactive terminal CLI (`npx social-preview`) or import directly into your Next.js / Node.js build pipelines.

---

## Quick Start (CLI)

Generate a preview image instantly with `npx`:

```bash
# Basic dark card (1200x630)
npx social-preview "Building in Public in 2026" -s "Lessons from shipping developer tools."

# Terminal theme with custom tags and custom output path
npx social-preview "Release v2.0.0" \
  --subtitle "Zero-dependency Rust-backed social card generator." \
  --theme terminal \
  --tags "Node.js,Rust,CLI,OpenSource" \
  --out og-terminal.png

# GitHub repository banner
npx social-preview "PipManager" \
  --subtitle "High-contrast visual package manager for local Python environments." \
  --preset github \
  --badge "ECO-NULL / PIPMANAGER" \
  --author "eco-null" \
  --out banner.png

# Raw SVG output
npx social-preview "Architecture Breakdown" --format svg -o preview.svg
```

Install globally:

```bash
npm install -g social-preview-cli
```

---

## CLI Options

```text
USAGE:
  $ social-preview "<title>" [options]

OPTIONS:
  -s, --subtitle <text>   Subtitle description
  -o, --out <path>        Output file path (default: preview.png)
  -t, --theme <name>      Color theme: dark (default), light, terminal, gold
  -p, --preset <name>     Size preset: og (1200x630, default), twitter, github, square
  -b, --badge <text>      Top brand badge label (default: POSTREADY.ORG)
  -a, --author <name>     Author name (default: eco-null)
  -u, --url <text>        URL or domain watermark (default: postready.org)
  --tags <item,item>      Comma-separated metadata pill tags
  --format <svg|png>      Output format (auto-detected from file extension)
  --no-grid               Disable subtle dot grid background
  -h, --help              Show help message
  -v, --version           Show version
```

---

## Programmatic API

Install locally:

```bash
npm install social-preview-cli
```

### Next.js / Node.js ESM Usage:

```javascript
import fs from 'node:fs';
import { generatePng, generateSvg } from 'social-preview-cli';

// 1. Generate PNG buffer for an API route or build script
const pngBuffer = generatePng({
  title: 'How We Scaled Our Open Source Suite',
  subtitle: 'Practical architecture lessons from building 4 micro developer tools.',
  theme: 'dark',
  preset: 'og',
  badge: 'POSTREADY.ORG',
  author: 'eco-null',
  tags: ['Architecture', 'SaaS', 'DevTools']
});

fs.writeFileSync('./public/og-image.png', pngBuffer);

// 2. Generate raw SVG string
const svgString = generateSvg({
  title: 'Clean Minimalist Social Cards',
  theme: 'terminal'
});
```

---

## Theme Previews

| Theme | Background | Text Primary | Accent Highlight |
| :--- | :--- | :--- | :--- |
| `dark` (default) | `#09090b` (Matte Black) | `#fafafa` | `#ffffff` Badge |
| `light` | `#fafafa` (Paper White) | `#09090b` | `#09090b` Badge |
| `terminal` | `#0c0c0c` (Graphite) | `#00ff66` | Phosphor Green |
| `gold` | `#0a0a0c` (Obsidian) | `#fbf8ee` | `#d4af37` Warm Gold |

---

## Integration with PostReady

This tool was designed for **[PostReady.org](https://postready.org)** — the AI content studio turning blog articles, podcasts, and notes into publish-ready X threads and LinkedIn carousels.

Explore other tools in the ecosystem:
- [md-to-thread](https://github.com/postready/md-to-thread) — Split markdown files into X threads and carousels.
- [social-text-styler](https://github.com/postready/social-text-styler) — Zero-dependency Unicode formatter for LinkedIn & X.
- [awesome-tech-hooks](https://github.com/postready/awesome-tech-hooks) — 500+ curated viral hooks and frameworks.

---

## License

MIT © [eco-null](https://github.com/eco-null)
