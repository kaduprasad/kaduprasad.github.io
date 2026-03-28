# Copilot Instructions — Portfolio Website

## Overview
Single-page personal portfolio/resume for a full-stack developer. Custom dark theme with scroll-triggered animations. No frameworks — pure HTML/CSS/JS.

## Tech Stack
- **HTML5** with semantic sections (`#about`, `#experience`, `#projects`, `#education`, `#skills`, `#certifications`, `#interests`)
- **Custom CSS** — dark theme, CSS custom properties, no Bootstrap
- **Font Awesome 5.15.4** — icons (CDN, deferred)
- **Google Fonts** — Inter (all weights)
- **Vanilla JS** — Intersection Observer for scroll reveal + active nav + mobile menu

## Structure
- `index.html` — entire site (single page, section-based navigation)
- `css/styles.css` — custom dark theme (accent: `#4a90e8`), animations, responsive
- `js/scripts.js` — scroll reveal, navbar effects, mobile toggle, back-to-top
- `assets/img/` — profile image
- `assets/icons/` — favicon/icons

## Key Patterns
- Fixed top navbar with glassmorphism on scroll (backdrop-filter blur)
- Hero section with animated gradient orbs background
- Staggered fadeInUp animations on hero content load
- `.reveal` class + Intersection Observer for scroll-triggered entrance animations
- Timeline component for experience/education with accent-colored markers
- Card-based project grid with hover lift + gradient top border
- Tech tags as styled pills throughout
- Full-screen mobile nav overlay with animated hamburger
- CSS custom properties (`--accent`, `--bg-*`, `--text-*`) for easy theming
- Deployed as static files on GitHub Pages (no build step)
