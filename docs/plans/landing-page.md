# Landing Page Design Plan

> Issue #4 — 增加一个科技感满满的落地页

## Problem Statement

The project needs a visually impressive, tech-themed landing page to showcase the utility library. The page must use **pure HTML + CSS + JS** (no frameworks, no build step) and be openable directly in a browser via `file://` or any static server.

## Design Direction

A futuristic / cyberpunk-inspired single-page landing with:

- **Dark background** with subtle animated particle grid or circuit-board pattern
- **Glowing accent colors** — cyan/electric blue (`#00f0ff`) + purple (`#8b5cf6`) gradient highlights
- **Glassmorphism cards** for each utility function showcase
- **Typing animation** on the hero tagline
- **Smooth scroll-linked animations** using `IntersectionObserver` (no libraries)
- **Responsive** — works on mobile through desktop

## File Structure

```
landing/
├── index.html      — semantic HTML5 structure
├── style.css       — all styles, animations, responsive breakpoints
└── main.js         — particles, typing effect, scroll animations, live demos
```

All files live under a new `landing/` directory at project root. No changes to existing `src/` or `test/`.

## Page Sections

### 1. Hero Section
- Full-viewport dark background with animated particle canvas
- Project name "Loop Kit Playground" in large, glowing text
- Typing animation subtitle: "A lightweight utility toolkit for modern JavaScript"
- CTA button → scrolls to Features

### 2. Features Section
- Grid of glassmorphism cards (one per utility function: `capitalize`, `sum`, `clamp`, `truncate`, `slugify`)
- Each card: function name, one-line description, mini code example
- Cards fade-in on scroll using `IntersectionObserver`

### 3. Live Demo Section
- Interactive code playground (textarea input → live output)
- Dropdown to select a utility function
- User types input, sees formatted output in real-time
- Since this is a landing page (not Node.js), re-implement the utility functions inline in browser JS

### 4. Footer
- GitHub link, license info
- Subtle glow divider

## Data Flow

```
User interacts with Live Demo
  → JS reads selected function + input text
  → Calls inline utility function
  → Renders result in output panel
```

No server-side logic. Everything runs client-side.

## Sub-tasks

| # | Task | Complexity | Depends on |
|---|------|------------|------------|
| 1 | Create `landing/index.html` with semantic structure | Low | — |
| 2 | Create `landing/style.css` — dark theme, glassmorphism, responsive layout | Medium | 1 |
| 3 | Create `landing/main.js` — particle canvas, typing effect, scroll animations | Medium | 1 |
| 4 | Add live demo logic (inline utils, dropdown, real-time output) | Medium | 1, 3 |
| 5 | Polish: hover effects, micro-animations, mobile breakpoints | Low | 2, 3 |

Sub-tasks 1-4 can be done in a single implementation round since they form one cohesive deliverable. Task 5 is polish that can ride with the same PR.

## Constraints

- **No external dependencies** — no CDN links, no npm packages
- **No build step** — open `landing/index.html` directly in browser
- **No changes to existing code** — `src/`, `test/`, `package.json` stay untouched
- Re-implement utility functions in `main.js` for browser demo (they're simple pure functions)

## Verification

- Open `landing/index.html` in a browser and verify:
  - Visual: dark theme, particle animation, glassmorphism cards render correctly
  - Interaction: typing animation plays, cards fade-in on scroll, live demo works
  - Responsive: page is usable on narrow viewports (≤ 480px)
- Existing `npm test` still passes (no changes to src/test)
