#!/usr/bin/env python3
"""
LEGO Retired Set Value Tracker — Auto-updater
=============================================
Scrapes current sealed-box prices from BrickEconomy for a curated list
of retired LEGO sets, computes live ROI, picks the Top 5, regenerates
the Tidbyt .star file, and optionally pushes to your device.

Usage:
    python update_lego_tracker.py                  # update .star file only
    python update_lego_tracker.py --push <device-id>  # update + push to Tidbyt

Cron (run nightly at 8am):
    0 8 * * * cd /path/to/repo && python tidbyt/update_lego_tracker.py --push YOUR_DEVICE_ID
"""

import re
import time
import argparse
import subprocess
from pathlib import Path

import requests
from bs4 import BeautifulSoup

# ── Config ────────────────────────────────────────────────────────────────────

OUTPUT_STAR = Path(__file__).parent / "lego_value_tracker.star"
HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"}
DELAY_BETWEEN_REQUESTS = 2   # seconds — be polite to BrickEconomy

# ── Set database ──────────────────────────────────────────────────────────────
# Format: (set_number, brickeconomy_slug, display_name, retail_price_usd)

SETS = [
    ("10030", "lego-star-wars-imperial-star-destroyer",                      "Imp. Star Dest.",       299),
    ("10143", "lego-star-wars-death-star-ii",                                "Death Star II",         299),
    ("10179", "lego-star-wars-ultimate-collectors-series-millennium-falcon",  "UCS Falcon",           499),
    ("10188", "lego-star-wars-death-star",                                   "Death Star (2008)",     399),
    ("10240", "lego-star-wars-red-five-x-wing-starfighter",                  "Red Five X-Wing",       199),
    ("75060", "lego-star-wars-slave-i",                                      "Slave I UCS",           199),
    ("75159", "lego-star-wars-death-star-4",                                 "Death Star (2016)",     499),
    ("75252", "lego-star-wars-imperial-star-destroyer-2",                    "ISD UCS 2019",          699),
    ("71043", "lego-harry-potter-hogwarts-castle",                           "Hogwarts Castle",       469),
    ("75978", "lego-harry-potter-diagon-alley",                              "Diagon Alley",          399),
    ("21309", "lego-ideas-nasa-apollo-saturn-v",                             "NASA Saturn V",         119),
    ("21310", "lego-ideas-old-fishing-store",                                "Old Fishing Store",     149),
    ("21313", "lego-ideas-ship-in-a-bottle",                                 "Ship in a Bottle",       69),
    ("21318", "lego-ideas-tree-house",                                       "Tree House",            199),
    ("21322", "lego-ideas-pirates-of-barracuda-bay",                         "Barracuda Bay",         199),
    ("10256", "lego-architecture-taj-mahal",                                 "Taj Mahal",             369),
    ("10253", "lego-creator-expert-big-ben",                                 "Big Ben",               239),
    ("10232", "lego-creator-expert-palace-cinema",                           "Palace Cinema",         149),
    ("10262", "lego-creator-expert-james-bond-aston-martin-db5",             "Aston Martin DB5",      199),
    ("10265", "lego-creator-expert-ford-mustang",                            "Ford Mustang",          149),
    ("42056", "lego-technic-porsche-911-gt3-rs",                             "Porsche 911 GT3 RS",    299),
    ("42083", "lego-technic-bugatti-chiron",                                 "Bugatti Chiron",        449),
    ("10937", "lego-super-heroes-batman-arkham-asylum-breakout",             "Arkham Asylum",         159),
    ("76042", "lego-marvel-super-heroes-the-shield-helicarrier",             "SHIELD Helicarrier",    349),
]

# ── Scraper ───────────────────────────────────────────────────────────────────

def fetch_current_value(set_num: str, slug: str) -> float | None:
    """Scrape BrickEconomy for the current sealed-box value of a set."""
    url = f"https://www.brickeconomy.com/set/{set_num}-1/{slug}"
    try:
        r = requests.get(url, headers=HEADERS, timeout=12)
        r.raise_for_status()
        soup = BeautifulSoup(r.text, "html.parser")

        # Find "Today's value $X,XXX.XX" in the page
        tag = soup.find(string=re.compile(r"Today.s value"))
        if not tag:
            return None

        parent = tag.parent
        for _ in range(6):
            txt = parent.get_text(separator=" ", strip=True)
            m = re.search(r"Today.s value\s+\$([\d,]+\.?\d*)", txt)
            if m:
                return float(m.group(1).replace(",", ""))
            parent = parent.parent

    except Exception as e:
        print(f"    ⚠  Error fetching {set_num}: {e}")
    return None


def scrape_all() -> list[dict]:
    """Fetch live prices for all sets. Falls back to None if unreachable."""
    results = []
    print(f"Fetching prices for {len(SETS)} sets from BrickEconomy...\n")

    for i, (num, slug, name, retail) in enumerate(SETS, 1):
        print(f"  [{i:2}/{len(SETS)}] {num} {name}...", end=" ", flush=True)
        current = fetch_current_value(num, slug)

        if current:
            roi = round((current - retail) / retail * 100)
            results.append({
                "num":     num,
                "name":    name,
                "retail":  retail,
                "current": current,
                "roi":     roi,
            })
            print(f"${current:,.2f}  ROI: +{roi}%")
        else:
            print("skipped (not found)")

        if i < len(SETS):
            time.sleep(DELAY_BETWEEN_REQUESTS)

    return results

# ── .star file generator ──────────────────────────────────────────────────────

def roi_color(r: int) -> str:
    if r >= 900:  return "#00FF9D"
    if r >= 400:  return "#7FFF6B"
    if r >= 200:  return "#FFD700"
    return "#FFAA33"


def generate_star(top5: list[dict]) -> str:
    from datetime import date
    today = date.today().strftime("%B %d, %Y")

    sets_starlark = ""
    for s in top5:
        current_fmt = f"${s['current']:,.0f}"
        sets_starlark += f"""    {{
        "rank":    {s['_rank']},
        "name":    "{s['name']}",
        "num":     "{s['num']}",
        "roi":     {s['roi']},
        "retail":  {s['retail']},
        "current": "{current_fmt}",
    }},
"""

    return f'''"""
LEGO Retired Set Value Tracker — Tidbyt App
Auto-generated by update_lego_tracker.py
Last updated: {today}

Top 5 sets by live ROI % (sealed box, BrickEconomy data)
"""

load("render.star", "render")

YELLOW = "#FFD700"
GREEN  = "#00FF9D"
WHITE  = "#FFFFFF"
DIM    = "#444444"
BG     = "#0A0A0A"

SETS = [
{sets_starlark}]

def roi_color(r):
    if r >= 900:
        return "#00FF9D"
    elif r >= 400:
        return "#7FFF6B"
    elif r >= 200:
        return "#FFD700"
    else:
        return "#FFAA33"

def title_frame():
    return render.Box(
        width  = 64,
        height = 32,
        color  = BG,
        child  = render.Column(
            main_align  = "center",
            cross_align = "center",
            expanded    = True,
            children    = [
                render.Text("TOP 5 LEGO", color = YELLOW, font = "tb-8"),
                render.Box(height = 2),
                render.Text("Retired Set ROI", color = DIM, font = "tom-thumb"),
                render.Box(height = 2),
                render.Text("Sealed Box Est.", color = DIM, font = "tom-thumb"),
            ],
        ),
    )

def set_frame(s):
    rank_color = YELLOW if s["rank"] <= 3 else WHITE
    return render.Box(
        width  = 64,
        height = 32,
        color  = BG,
        child  = render.Column(
            expanded = True,
            children = [
                render.Row(
                    cross_align = "center",
                    children    = [
                        render.Text("#%d " % s["rank"], color = rank_color, font = "tom-thumb"),
                        render.Text(s["num"], color = DIM, font = "tom-thumb"),
                    ],
                ),
                render.Box(height = 1),
                render.Marquee(
                    width        = 64,
                    offset_start = 2,
                    child        = render.Text(s["name"], color = WHITE, font = "tb-8"),
                ),
                render.Box(height = 2),
                render.Text("+%d%% ROI" % s["roi"], color = roi_color(s["roi"]), font = "tom-thumb"),
                render.Box(height = 1),
                render.Text(s["current"] + " sealed", color = YELLOW, font = "tom-thumb"),
            ],
        ),
    )

def main():
    frames = [title_frame()]
    for s in SETS:
        frames.append(set_frame(s))
    return render.Root(
        delay = 3500,
        child = render.Animation(children = frames),
    )
'''


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Update LEGO Tidbyt tracker with live prices")
    parser.add_argument("--push", metavar="DEVICE_ID", help="Push to Tidbyt after updating")
    parser.add_argument("--dry-run", action="store_true", help="Print top 5 without writing files")
    args = parser.parse_args()

    # Scrape
    results = scrape_all()

    if not results:
        print("\n❌ No data fetched. Check your internet connection.")
        return

    # Sort and pick top 5
    results.sort(key=lambda x: x["roi"], reverse=True)
    top5 = results[:5]
    for i, s in enumerate(top5, 1):
        s["_rank"] = i

    print(f"\n{'─'*50}")
    print("📊 LIVE TOP 5 BY ROI")
    print(f"{'─'*50}")
    for s in top5:
        print(f"  #{s['_rank']} {s['num']} {s['name']:30} +{s['roi']:,}%  ${s['current']:,.2f}")
    print(f"{'─'*50}\n")

    if args.dry_run:
        print("Dry run — no files written.")
        return

    # Write .star file
    star_content = generate_star(top5)
    OUTPUT_STAR.write_text(star_content)
    print(f"✅ Written: {OUTPUT_STAR}")

    # Push to Tidbyt
    if args.push:
        print(f"\n🚀 Pushing to Tidbyt device: {args.push}")
        result = subprocess.run(
            ["pixlet", "push", args.push, str(OUTPUT_STAR)],
            capture_output=True, text=True
        )
        if result.returncode == 0:
            print("✅ Pushed successfully!")
        else:
            print(f"❌ Push failed: {result.stderr}")
    else:
        print(f"\nTo push manually:")
        print(f"  pixlet push <your-device-id> {OUTPUT_STAR}")
        print(f"\nTo automate with cron (8am daily):")
        print(f"  0 8 * * * cd {OUTPUT_STAR.parent.parent} && python tidbyt/update_lego_tracker.py --push YOUR_DEVICE_ID")


if __name__ == "__main__":
    main()
