# 🧱 LEGO Value Tracker

An interactive dashboard for browsing retired LEGO sets and their resale appreciation over time.

## Features

- 📦 25 retired sets with real retail prices and current sealed-box market estimates
- 🔍 Search by set name, theme, or set number
- 🏷️ Filter by theme (Star Wars, Harry Potter, Ideas, Technic, and more)
- 📊 Sort by ROI %, current value, retail price, year retired, or piece count
- 🟡 Color-coded ROI badges — instantly see which sets are goldmines

## Data

Values are sealed-box secondary market estimates based on BrickLink and eBay averages. Not financial advice.

## Tech Stack

- React (JSX)
- No external dependencies — pure React + inline styles

## Getting Started

```bash
# Drop App.jsx into any React project (Vite, CRA, etc.)
npm create vite@latest lego-tracker -- --template react
cd lego-tracker
cp src/App.jsx ./src/App.jsx
npm install && npm run dev
```

## Themes Covered

| Theme | Sets |
|-------|------|
| Star Wars | UCS Falcon, Imperial Star Destroyer, Death Star II + more |
| Harry Potter | Hogwarts Castle, Diagon Alley |
| Ideas | Saturn V, Tree House, Old Fishing Store |
| Creator Expert | Big Ben, Palace Cinema, Aston Martin DB5 |
| Technic | Porsche 911 GT3 RS, Bugatti Chiron |
| Super Heroes | SHIELD Helicarrier, Arkham Asylum |
| Architecture | Taj Mahal, Great Pyramid |

---

> Some retired LEGO sets have appreciated 500–900%+ sealed. This dashboard helps you track which ones.
