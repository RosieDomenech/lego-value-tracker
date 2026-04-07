import { useState, useMemo } from "react";

const SETS = [
  { id: "10179", name: "Ultimate Collector's Millennium Falcon", theme: "Star Wars", year: 2007, retired: 2010, retail: 499, current: 5200, pieces: 5195 },
  { id: "10030", name: "Imperial Star Destroyer", theme: "Star Wars", year: 2002, retired: 2003, retail: 299, current: 4100, pieces: 3104 },
  { id: "10143", name: "Death Star II", theme: "Star Wars", year: 2005, retired: 2009, retail: 299, current: 3200, pieces: 3441 },
  { id: "10240", name: "Red Five X-Wing Starfighter", theme: "Star Wars", year: 2013, retired: 2015, retail: 199, current: 650, pieces: 1559 },
  { id: "75060", name: "Slave I (UCS)", theme: "Star Wars", year: 2015, retired: 2019, retail: 199, current: 520, pieces: 1996 },
  { id: "75159", name: "Death Star", theme: "Star Wars", year: 2016, retired: 2020, retail: 499, current: 720, pieces: 4016 },
  { id: "75252", name: "Imperial Star Destroyer (UCS)", theme: "Star Wars", year: 2019, retired: 2023, retail: 699, current: 860, pieces: 4784 },
  { id: "71043", name: "Hogwarts Castle", theme: "Harry Potter", year: 2018, retired: 2022, retail: 469, current: 750, pieces: 6020 },
  { id: "75978", name: "Diagon Alley", theme: "Harry Potter", year: 2020, retired: 2023, retail: 399, current: 580, pieces: 5544 },
  { id: "21309", name: "NASA Apollo Saturn V", theme: "Ideas", year: 2017, retired: 2019, retail: 119, current: 290, pieces: 1969 },
  { id: "21313", name: "Ship in a Bottle", theme: "Ideas", year: 2018, retired: 2020, retail: 69, current: 185, pieces: 962 },
  { id: "21310", name: "Old Fishing Store", theme: "Ideas", year: 2017, retired: 2019, retail: 149, current: 380, pieces: 2049 },
  { id: "21318", name: "Tree House", theme: "Ideas", year: 2019, retired: 2022, retail: 199, current: 310, pieces: 3036 },
  { id: "10256", name: "Taj Mahal", theme: "Architecture", year: 2017, retired: 2021, retail: 369, current: 530, pieces: 5923 },
  { id: "21058", name: "Great Pyramid of Giza", theme: "Architecture", year: 2022, retired: 2024, retail: 179, current: 230, pieces: 1476 },
  { id: "10253", name: "Big Ben", theme: "Creator Expert", year: 2016, retired: 2019, retail: 239, current: 490, pieces: 4163 },
  { id: "10232", name: "Palace Cinema", theme: "Creator Expert", year: 2013, retired: 2016, retail: 149, current: 520, pieces: 2196 },
  { id: "10262", name: "James Bond Aston Martin DB5", theme: "Creator Expert", year: 2018, retired: 2021, retail: 199, current: 390, pieces: 1295 },
  { id: "10265", name: "Ford Mustang", theme: "Creator Expert", year: 2019, retired: 2022, retail: 149, current: 230, pieces: 1471 },
  { id: "42056", name: "Porsche 911 GT3 RS", theme: "Technic", year: 2016, retired: 2019, retail: 299, current: 780, pieces: 2704 },
  { id: "42083", name: "Bugatti Chiron", theme: "Technic", year: 2018, retired: 2021, retail: 449, current: 680, pieces: 3599 },
  { id: "10937", name: "Batman: Arkham Asylum Breakout", theme: "Super Heroes", year: 2013, retired: 2015, retail: 159, current: 850, pieces: 1619 },
  { id: "76042", name: "SHIELD Helicarrier", theme: "Super Heroes", year: 2015, retired: 2016, retail: 349, current: 750, pieces: 2996 },
  { id: "21322", name: "Pirates of Barracuda Bay", theme: "Ideas", year: 2020, retired: 2022, retail: 199, current: 380, pieces: 2545 },
  { id: "10188", name: "Death Star (Original)", theme: "Star Wars", year: 2008, retired: 2015, retail: 399, current: 1100, pieces: 3803 },
];

const THEMES = ["All", ...Array.from(new Set(SETS.map(s => s.theme))).sort()];
const SORTS = [
  { label: "ROI %", key: "roi", dir: -1 },
  { label: "Current Value", key: "current", dir: -1 },
  { label: "Retail Price", key: "retail", dir: -1 },
  { label: "Year Retired", key: "retired", dir: -1 },
  { label: "Pieces", key: "pieces", dir: -1 },
];

function roi(set) {
  return Math.round(((set.current - set.retail) / set.retail) * 100);
}

function roiColor(r) {
  if (r >= 300) return "#00ff9d";
  if (r >= 150) return "#7fff6b";
  if (r >= 75) return "#ffd700";
  if (r >= 25) return "#ffaa33";
  return "#ff6b6b";
}

function SetCard({ set }) {
  const r = roi(set);
  const imgSrc = `https://images.brickset.com/sets/images/${set.id}-1.jpg`;
  const [imgOk, setImgOk] = useState(true);

  return (
    <div style={{
      background: "#111",
      border: "1px solid #222",
      borderRadius: 4,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      transition: "transform 0.15s, border-color 0.15s",
      cursor: "default",
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.borderColor = "#444";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "#222";
      }}
    >
      {/* Image */}
      <div style={{
        background: "#1a1a1a",
        height: 160,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
      }}>
        {imgOk ? (
          <img
            src={imgSrc}
            alt={set.name}
            onError={() => setImgOk(false)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div style={{ textAlign: "center", color: "#444" }}>
            <div style={{ fontSize: 32, marginBottom: 4 }}>🧱</div>
            <div style={{ fontFamily: "monospace", fontSize: 11 }}>{set.id}</div>
          </div>
        )}
        {/* ROI badge */}
        <div style={{
          position: "absolute", top: 8, right: 8,
          background: roiColor(r),
          color: "#000",
          fontFamily: "'Courier New', monospace",
          fontWeight: 900,
          fontSize: 12,
          padding: "3px 7px",
          borderRadius: 2,
        }}>
          +{r}%
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "12px 14px", flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{
          fontFamily: "'Courier New', monospace",
          fontSize: 10,
          color: "#555",
          letterSpacing: 2,
          textTransform: "uppercase",
        }}>
          {set.theme} · {set.id}
        </div>
        <div style={{
          fontFamily: "Georgia, serif",
          fontSize: 14,
          color: "#eee",
          lineHeight: 1.3,
          fontWeight: 700,
        }}>
          {set.name}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
          <Stat label="Retail" value={`$${set.retail}`} />
          <Stat label="Now" value={`$${set.current.toLocaleString()}`} highlight />
          <Stat label="Pieces" value={set.pieces.toLocaleString()} />
          <Stat label="Retired" value={set.retired} />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#444", textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
      <div style={{
        fontFamily: "'Courier New', monospace",
        fontSize: 13,
        color: highlight ? "#ffd700" : "#aaa",
        fontWeight: highlight ? 700 : 400,
      }}>{value}</div>
    </div>
  );
}

export default function App() {
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState("All");
  const [sortIdx, setSortIdx] = useState(0);

  const filtered = useMemo(() => {
    let sets = SETS.filter(s => {
      const q = search.toLowerCase();
      return (
        (theme === "All" || s.theme === theme) &&
        (s.name.toLowerCase().includes(q) || s.id.includes(q) || s.theme.toLowerCase().includes(q))
      );
    });
    const { key, dir } = SORTS[sortIdx];
    sets.sort((a, b) => {
      const va = key === "roi" ? roi(a) : a[key];
      const vb = key === "roi" ? roi(b) : b[key];
      return (vb - va) * dir;
    });
    return sets;
  }, [search, theme, sortIdx]);

  const avgRoi = Math.round(SETS.reduce((s, x) => s + roi(x), 0) / SETS.length);
  const topSet = [...SETS].sort((a, b) => roi(b) - roi(a))[0];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      color: "#eee",
      fontFamily: "Georgia, serif",
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid #1a1a1a",
        padding: "32px 32px 24px",
        background: "#0a0a0a",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 10,
            color: "#444",
            letterSpacing: 4,
            textTransform: "uppercase",
            marginBottom: 8,
          }}>
            Retired Set Investment Index
          </div>
          <h1 style={{
            margin: 0,
            fontSize: "clamp(28px, 5vw, 52px)",
            fontWeight: 900,
            letterSpacing: -1,
            lineHeight: 1,
            color: "#ffd700",
          }}>
            LEGO Value Tracker
          </h1>
          <p style={{ margin: "10px 0 24px", color: "#555", fontSize: 14, fontFamily: "'Courier New', monospace" }}>
            Retired sets · resale appreciation · sealed box estimates
          </p>

          {/* Summary stats */}
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            {[
              { label: "Sets Tracked", value: SETS.length },
              { label: "Avg. ROI", value: `+${avgRoi}%` },
              { label: "Top Performer", value: topSet.id },
              { label: "Best Return", value: `+${roi(topSet)}%` },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#444", letterSpacing: 2, textTransform: "uppercase" }}>{s.label}</div>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 22, color: "#ffd700", fontWeight: 700 }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{
        borderBottom: "1px solid #141414",
        padding: "16px 32px",
        background: "#0d0d0d",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          {/* Search */}
          <input
            placeholder="Search sets, themes, IDs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              background: "#111",
              border: "1px solid #222",
              borderRadius: 2,
              color: "#eee",
              fontFamily: "'Courier New', monospace",
              fontSize: 13,
              padding: "8px 12px",
              outline: "none",
              width: 220,
            }}
          />

          {/* Theme filter */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {THEMES.map(t => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                style={{
                  background: theme === t ? "#ffd700" : "transparent",
                  border: `1px solid ${theme === t ? "#ffd700" : "#222"}`,
                  borderRadius: 2,
                  color: theme === t ? "#000" : "#555",
                  fontFamily: "'Courier New', monospace",
                  fontSize: 11,
                  padding: "5px 10px",
                  cursor: "pointer",
                  transition: "all 0.1s",
                  fontWeight: theme === t ? 700 : 400,
                }}
              >{t}</button>
            ))}
          </div>

          {/* Sort */}
          <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#444", letterSpacing: 1 }}>SORT</span>
            {SORTS.map((s, i) => (
              <button
                key={s.label}
                onClick={() => setSortIdx(i)}
                style={{
                  background: sortIdx === i ? "#1a1a1a" : "transparent",
                  border: `1px solid ${sortIdx === i ? "#333" : "#1a1a1a"}`,
                  borderRadius: 2,
                  color: sortIdx === i ? "#ffd700" : "#444",
                  fontFamily: "'Courier New', monospace",
                  fontSize: 10,
                  padding: "5px 8px",
                  cursor: "pointer",
                  transition: "all 0.1s",
                }}
              >{s.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 32px 48px" }}>
        <div style={{
          fontFamily: "'Courier New', monospace",
          fontSize: 10,
          color: "#333",
          letterSpacing: 2,
          marginBottom: 16,
          textTransform: "uppercase",
        }}>
          {filtered.length} sets · sorted by {SORTS[sortIdx].label}
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 12,
        }}>
          {filtered.map(s => <SetCard key={s.id} set={s} />)}
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", color: "#333", fontFamily: "'Courier New', monospace", fontSize: 13, padding: "80px 0" }}>
            No sets match your search.
          </div>
        )}

        {/* Footer note */}
        <div style={{
          marginTop: 48,
          paddingTop: 24,
          borderTop: "1px solid #141414",
          fontFamily: "'Courier New', monospace",
          fontSize: 10,
          color: "#2a2a2a",
          lineHeight: 1.8,
        }}>
          Values are estimates based on sealed-box secondary market averages (BrickLink, eBay). Not financial advice.<br/>
          Data reflects approximate market conditions as of early 2025.
        </div>
      </div>
    </div>
  );
}
