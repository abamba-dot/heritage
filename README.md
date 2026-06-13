# HÉRITAGES

Client demo for the HÉRITAGES apparel experience: hero animation, city collections, product configurator, cart drawer, and WhatsApp ordering.

## Stack

- React 18
- Vite 5
- Tailwind CSS
- GSAP + ScrollTrigger
- `@gsap/react`
- Framer Motion
- Lenis smooth scroll on desktop

## Local Setup

```bash
npm install
npm run dev
```

Local URL:

```text
http://localhost:5173
```

## Production Build

```bash
npm run build
npm run preview
```

The production output is generated in `dist/`.

## Deploy On Vercel

Vercel settings:

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

This repo includes `vercel.json` with the same build settings and an SPA rewrite to `index.html`.

## Main Features

- Loading screen with GSAP animation
- Sticky scroll-mask hero
- City collection section with selector
- Dynamic configurator:
  - all countries
  - free city input
  - style, color, size
  - multiple custom personalization requests
- Cart management:
  - add configured products
  - quantity controls
  - remove item
  - clear cart
  - persistent cart via `localStorage`
  - WhatsApp order message
- Responsive mobile-friendly layout

## Project Structure

```text
src/
  App.jsx
  index.css
  components/
    CartDrawer.jsx
    CitiesSection.jsx
    CitySelector.jsx
    Configurator.jsx
    Footer.jsx
    Header.jsx
    Hero.jsx
    LoadingScreen.jsx
  context/
    CartContext.jsx
    ThemeContext.jsx
  data/
    cities.js
    worldCountries.js
public/
  favicon.svg
  images/
```

## Git And Vercel Flow

```bash
git init -b main
git add .
git commit -m "Prepare Heritages client demo"
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

Then import the GitHub repository in Vercel.

