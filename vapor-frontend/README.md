# Vapor - Steam-inspired Gaming Platform

A fully functional React frontend clone of Steam, rebranded as **Vapor** — your gaming universe.

## Features

- **Home Page** — Auto-rotating hero banner with featured games, top sellers, special offers, and new releases
- **Game Store** — 45+ top games with search, genre filtering, sort options, and discount tags
- **Game Detail Pages** — Full info pages with reviews, similar games, and cart/wishlist actions
- **Shopping Cart** — Add/remove games, order summary, and simulated checkout that earns Vapor Points
- **Vapor Points Store** — Buy points packages and redeem for cosmetics, coupons, and rewards

## Games Included (45+)

Elden Ring, Cyberpunk 2077, Red Dead Redemption 2, Counter-Strike 2, The Witcher 3, GTA V, Baldur's Gate 3, Hollow Knight, Dota 2, Stardew Valley, Dark Souls III, God of War, Minecraft, Portal 2, Terraria, Hades, Apex Legends, Monster Hunter: World, Sekiro, Fallout 4, Borderlands 3, Death Stranding, Rust, Skyrim, Persona 5 Royal, Divinity: Original Sin 2, Celeste, No Man's Sky, Doom Eternal, Resident Evil Village, Sifu, Returnal, Disco Elysium, Deep Rock Galactic, Ori and the Will of the Wisps, Warframe, Cuphead, Path of Exile, It Takes Two, Ghostrunner, Crusader Kings III, Factorio, Subnautica, Forza Horizon 5, Satisfactory

## Tech Stack

- **React 18** with React Router v6
- **Vite** build tool
- Pure CSS (no UI library) — dark gaming theme

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
  components/
    Navbar.jsx / .css    — Sticky navigation with cart badge & points display
    Footer.jsx / .css    — Footer with links
    GameCard.jsx / .css  — Reusable game card with rating bar
  pages/
    Home.jsx / .css      — Landing page with hero & game sections
    Store.jsx / .css     — Browsable game store with filters
    GameDetail.jsx / .css — Individual game page
    Cart.jsx / .css      — Shopping cart & checkout
    PointsStore.jsx / .css — Vapor Points buy & redeem
  data/
    games.js             — All 45 games, genres, points packages & rewards
  index.css              — Global styles and CSS variables
  App.jsx                — Router setup
  main.jsx               — Entry point
```

## How Vapor Points Work

- Every $1 spent in the cart earns 100 Vapor Points automatically
- Points can also be purchased directly in the Points Store
- Redeem points for cosmetics, animated backgrounds, profile frames, and $5 coupons
