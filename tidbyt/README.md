# 🧱 LEGO Value Tracker: Tidbyt App

A **Tidbyt** app that cycles through the **Top 5 retired LEGO sets** by ROI % on your 64×32 LED display.

## What It Shows

Cycles through 6 frames (title + 5 sets), each displayed for 3.5 seconds:

| Frame | Content |
|-------|---------|
| Title | "TOP 5 LEGO / Retired Set ROI" |
| #1–5 | Rank · Set name · ROI % · Sealed value |

### Top 5 Sets (by ROI %)

| Rank | Set | Retail | Current | ROI |
|------|-----|--------|---------|-----|
| #1 | 10030 Imperial Star Destroyer | $299 | ~$4,100 | +1,271% |
| #2 | 10143 Death Star II | $299 | ~$3,200 | +970% |
| #3 | 10179 UCS Millennium Falcon | $499 | ~$5,200 | +941% |
| #4 | 10937 Batman: Arkham Asylum | $159 | ~$850 | +434% |
| #5 | 10232 Palace Cinema | $149 | ~$520 | +249% |

> Values are sealed-box secondary market estimates. Not financial advice.

## Setup

### 1. Install Pixlet

```bash
# macOS
brew install tidbyt/tidbyt/pixlet

# Linux
curl -LO https://github.com/tidbyt/pixlet/releases/latest/download/pixlet_linux_amd64.tar.gz
tar -xzf pixlet_linux_amd64.tar.gz && sudo mv pixlet /usr/local/bin/
```

### 2. Render a Preview

```bash
pixlet render lego_value_tracker.star
# Opens lego_value_tracker.webp in your browser
```

### 3. Push to Your Tidbyt

```bash
# Get your device ID from the Tidbyt app (Settings → Device ID)
pixlet push <your-device-id> lego_value_tracker.star
```

### 4. Schedule It (Optional)

To show it on rotation with other apps, use the Tidbyt API or community app submission.

## Customization

Edit `SETS` in the `.star` file to change which sets are displayed, or update `delay` in `render.Root()` to change how long each frame shows (in milliseconds).

## Color Key

| Color | Meaning |
|-------|---------|
| 🟢 Bright green | 900%+ ROI (legendary) |
| 🟩 Green | 400–899% ROI (excellent) |
| 🟡 Yellow | 200–399% ROI (very good) |
| 🟠 Orange | Under 200% ROI (solid) |
