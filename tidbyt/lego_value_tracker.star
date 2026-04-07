"""
LEGO Retired Set Value Tracker
Tidbyt app — 64x32 LED display

Cycles through the Top 5 retired LEGO sets by ROI %.
Each frame shows rank, set name, ROI, and current sealed value.

Install: pixlet push <your-device-id> lego_value_tracker.star
"""

load("render.star", "render")

# ── Colors ────────────────────────────────────────────────────────────────────
YELLOW  = "#FFD700"
GREEN   = "#00FF9D"
ORANGE  = "#FF8C00"
WHITE   = "#FFFFFF"
DIM     = "#444444"
BG      = "#0A0A0A"

# ── Top 5 retired sets by ROI % ───────────────────────────────────────────────
# ROI = (current - retail) / retail * 100
SETS = [
    {
        "rank":    1,
        "name":    "Imp. Star Dest.",
        "num":     "10030",
        "theme":   "Star Wars",
        "roi":     1271,
        "retail":  299,
        "current": "$4,100",
    },
    {
        "rank":    2,
        "name":    "Death Star II",
        "num":     "10143",
        "theme":   "Star Wars",
        "roi":     970,
        "retail":  299,
        "current": "$3,200",
    },
    {
        "rank":    3,
        "name":    "UCS Falcon",
        "num":     "10179",
        "theme":   "Star Wars",
        "roi":     941,
        "retail":  499,
        "current": "$5,200",
    },
    {
        "rank":    4,
        "name":    "Arkham Asylum",
        "num":     "10937",
        "theme":   "Super Heroes",
        "roi":     434,
        "retail":  159,
        "current": "$850",
    },
    {
        "rank":    5,
        "name":    "Palace Cinema",
        "num":     "10232",
        "theme":   "Creator Expert",
        "roi":     249,
        "retail":  149,
        "current": "$520",
    },
]

# ── ROI color based on magnitude ─────────────────────────────────────────────
def roi_color(r):
    if r >= 900:
        return "#00FF9D"   # Bright green — legendary
    elif r >= 400:
        return "#7FFF6B"   # Green — excellent
    elif r >= 200:
        return "#FFD700"   # Yellow — very good
    else:
        return "#FFAA33"   # Orange — solid

# ── Title frame ───────────────────────────────────────────────────────────────
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
                render.Text(
                    "TOP 5 LEGO",
                    color = YELLOW,
                    font  = "tb-8",
                ),
                render.Box(height = 2),
                render.Text(
                    "Retired Set ROI",
                    color = DIM,
                    font  = "tom-thumb",
                ),
                render.Box(height = 2),
                render.Text(
                    "Sealed Box Est.",
                    color = DIM,
                    font  = "tom-thumb",
                ),
            ],
        ),
    )

# ── Individual set frame ──────────────────────────────────────────────────────
def set_frame(s):
    rank_color = YELLOW if s["rank"] <= 3 else WHITE

    return render.Box(
        width  = 64,
        height = 32,
        color  = BG,
        child  = render.Column(
            expanded = True,
            children = [

                # Row 1: Rank + Set number
                render.Row(
                    cross_align = "center",
                    children    = [
                        render.Text(
                            "#%d " % s["rank"],
                            color = rank_color,
                            font  = "tom-thumb",
                        ),
                        render.Text(
                            s["num"],
                            color = DIM,
                            font  = "tom-thumb",
                        ),
                    ],
                ),

                render.Box(height = 1),

                # Row 2: Set name (scrolling marquee for long names)
                render.Marquee(
                    width        = 64,
                    offset_start = 2,
                    child        = render.Text(
                        s["name"],
                        color = WHITE,
                        font  = "tb-8",
                    ),
                ),

                render.Box(height = 2),

                # Row 3: ROI %
                render.Text(
                    "+%d%% ROI" % s["roi"],
                    color = roi_color(s["roi"]),
                    font  = "tom-thumb",
                ),

                render.Box(height = 1),

                # Row 4: Current sealed value
                render.Text(
                    s["current"] + " sealed",
                    color = YELLOW,
                    font  = "tom-thumb",
                ),
            ],
        ),
    )

# ── Main entry point ──────────────────────────────────────────────────────────
def main():
    frames = [title_frame()]

    for s in SETS:
        frames.append(set_frame(s))

    return render.Root(
        delay = 3500,   # ms per frame — 3.5s each
        child = render.Animation(
            children = frames,
        ),
    )
