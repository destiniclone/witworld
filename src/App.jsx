import { useState, useMemo, useRef, useEffect } from "react";

// ─── LOAD COUNTRIES FROM CSV ─────────────────────────────────────────────────────
// Locations are loaded from public/locations.csv
// You can edit that file to add, remove, or modify locations
let COUNTRIES = [];

async function loadCountriesFromCSV() {
  try {
    const response = await fetch('/locations.csv');
    const csv = await response.text();
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',');
    
    const countriesMap = new Map();
    
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',');
      const country = cols[0];
      const location = cols[1];
      const lat = parseFloat(cols[2]);
      const lng = parseFloat(cols[3]);
      const type = cols[4];
      const wiki = cols[5];
      
      if (!countriesMap.has(country)) {
        countriesMap.set(country, { name: country, wiki: wiki, cap: null, locs: [] });
      }
      
      const countryObj = countriesMap.get(country);
      
      if (type === 'capital') {
        countryObj.cap = [lat, lng];
      }
      
      countryObj.locs.push([location, lat, lng, type]);
    }
    
    COUNTRIES = Array.from(countriesMap.values());
    return true;
  } catch (e) {
    console.error("Error loading locations.csv:", e);
    return false;
  }
}

const toRad = d => (d * Math.PI) / 180;
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function bearing(lat1, lon1, lat2, lon2) {
  const dLon = toRad(lon2 - lon1);
  const y = Math.sin(dLon)*Math.cos(toRad(lat2));
  const x = Math.cos(toRad(lat1))*Math.sin(toRad(lat2)) - Math.sin(toRad(lat1))*Math.cos(toRad(lat2))*Math.cos(dLon);
  let b = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  const dirs = ["N","NE","E","SE","S","SW","W","NW"];
  return dirs[Math.round(b / 45) % 8];
}

function getPuzzleForDate(dateStr) {
  const hash = Array.from(dateStr).reduce((h, c) => ((h << 5) - h) + c.charCodeAt(0), 0);
  return Math.abs(hash) % COUNTRIES.length;
}

function getDailyPuzzle() {
  const now = new Date();
  const utcDateStr = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;
  const countryIdx = getPuzzleForDate(utcDateStr);
  const country = COUNTRIES[countryIdx];
  const locIdx = getPuzzleForDate(utcDateStr + "loc") % country.locs.length;
  const loc = country.locs[locIdx];
  return { country, loc, dateStr: utcDateStr };
}

function getRandomPuzzle() {
  if (COUNTRIES.length === 0) return null;
  const countryIdx = Math.floor(Math.random() * COUNTRIES.length);
  const country = COUNTRIES[countryIdx];
  const locIdx = Math.floor(Math.random() * country.locs.length);
  const loc = country.locs[locIdx];
  return { country, loc, dateStr: null };
}

function useWikiImages(locationName) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setImages([]);

    async function fetchImages() {
      try {
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(locationName)}&srlimit=1&format=json&origin=*`;
        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();
        const results = searchData?.query?.search;
        if (!results?.length) { if (!cancelled) setLoading(false); return; }

        const title = results[0].title;
        const imagesUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=images&format=json&origin=*`;
        const imagesRes = await fetch(imagesUrl);
        const imagesData = await imagesRes.json();
        const pages = imagesData?.query?.pages;
        const page = pages ? Object.values(pages)[0] : null;
        const images_list = page?.images || [];

        const imageUrls = [];
        // Keywords that indicate map/diagram graphics that would be too much of a hint
        const mapKeywords = /map|locate|position|geography|diagram|chart|flag|coat of arms|infobox|location map|administrative/i;
        
        for (const img of images_list.slice(0, 15)) {
          const imgTitle = img.title;
          // Skip SVG files and map-like graphics
          if (!/\.svg$/i.test(imgTitle) && !mapKeywords.test(imgTitle)) {
            const imgInfoUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(imgTitle)}&prop=imageinfo&iiprop=url&format=json&origin=*`;
            const imgInfoRes = await fetch(imgInfoUrl);
            const imgInfoData = await imgInfoRes.json();
            const imgPages = imgInfoData?.query?.pages;
            const imgPage = imgPages ? Object.values(imgPages)[0] : null;
            const url = imgPage?.imageinfo?.[0]?.url;
            if (url && imageUrls.length < 2) imageUrls.push(url);
            if (imageUrls.length === 2) break;
          }
        }

        if (!cancelled) { setImages(imageUrls); setLoading(false); }
      } catch (e) {
        if (!cancelled) { setLoading(false); }
      }
    }

    fetchImages();
    return () => { cancelled = true; };
  }, [locationName]);

  return { images, loading };
}

function ImageCarousel({ images, loading }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (loading) {
    return (
      <div style={{
        width: "100%", height: 220, background: "#111118",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: 8
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          border: "3px solid #333", borderTopColor: "#6366f1",
          animation: "spin 0.8s linear infinite"
        }} />
        <span style={{ color: "#444", fontSize: 13 }}>Loading photos…</span>
      </div>
    );
  }

  if (!images.length) {
    return (
      <div style={{
        width: "100%", height: 220, background: "#111118",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48
      }}>
        🌍
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%", height: 220, background: "#111118",
        position: "relative", overflow: "hidden", display: "flex",
        alignItems: "center", justifyContent: "center"
      }}
      onTouchStart={(e) => {
        const startX = e.touches[0].clientX;
        const handleTouchEnd = (e2) => {
          const endX = e2.changedTouches[0].clientX;
          if (startX - endX > 50) setCurrentIndex((i) => (i + 1) % images.length);
          else if (endX - startX > 50) setCurrentIndex((i) => (i - 1 + images.length) % images.length);
          document.removeEventListener("touchend", handleTouchEnd);
        };
        document.addEventListener("touchend", handleTouchEnd);
      }}
    >
      <img
        src={images[currentIndex]}
        alt={`Photo ${currentIndex + 1}`}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
      <div style={{
        position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
        display: "flex", gap: 6
      }}>
        {images.map((_, i) => (
          <div
            key={i}
            style={{
              width: 6, height: 6, borderRadius: "50%",
              background: i === currentIndex ? "#fff" : "rgba(255,255,255,0.4)"
            }}
          />
        ))}
      </div>
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 40,
        background: "linear-gradient(transparent, #1e1e2e)"
      }} />
    </div>
  );
}

function SearchDropdown({ value, onChange, disabled, placeholder }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);
  const countryNames = useMemo(() => COUNTRIES.map(c => c.name).sort(), []);
  const filtered = useMemo(() =>
    query.length === 0 ? countryNames : countryNames.filter(n => n.toLowerCase().includes(query.toLowerCase())),
    [query, countryNames]
  );

  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const select = (name) => { onChange(name); setQuery(""); setOpen(false); };

  return (
    <div ref={ref} style={{ position: "relative", flex: 1 }}>
      <div
        onClick={() => { if (!disabled) { setOpen(o => !o); setQuery(""); } }}
        style={{
          padding: "10px 14px", borderRadius: 8, border: `1px solid ${disabled ? "#333" : "#555"}`,
          background: disabled ? "#1a1a1a" : "#1e1e2e", color: value ? "#f8f8f2" : "#6b7280",
          cursor: disabled ? "not-allowed" : "pointer", display: "flex", justifyContent: "space-between",
          alignItems: "center", fontSize: 14, userSelect: "none", minWidth: 0,
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {value || placeholder}
        </span>
        <span style={{ marginLeft: 8, opacity: 0.5 }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 999,
          background: "#1e1e2e", border: "1px solid #555", borderRadius: 8,
          maxHeight: 220, overflow: "hidden", display: "flex", flexDirection: "column",
          boxShadow: "0 8px 24px rgba(0,0,0,0.6)"
        }}>
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search country…"
            style={{
              padding: "8px 12px", background: "#2a2a3e", border: "none", borderBottom: "1px solid #444",
              color: "#f8f8f2", fontSize: "16px", outline: "none"
            }}
          />
          <div style={{ overflowY: "auto", flex: 1 }}>
            {filtered.length === 0 && (
              <div style={{ padding: "10px 14px", color: "#666", fontSize: 13 }}>No results</div>
            )}
            {filtered.map(n => (
              <div
                key={n}
                onClick={() => select(n)}
                style={{
                  padding: "8px 14px", cursor: "pointer", fontSize: 13, color: "#f8f8f2",
                  background: n === value ? "#2a2a5e" : "transparent",
                  borderBottom: "1px solid #2a2a2a"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#2a2a4e"}
                onMouseLeave={e => e.currentTarget.style.background = n === value ? "#2a2a5e" : "transparent"}
              >
                {n}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function WITWorld() {
  const [loading, setLoading] = useState(true);
  const [puzzle, setPuzzle] = useState(null);
  const [guesses, setGuesses] = useState(Array(6).fill(""));
  const [submitted, setSubmitted] = useState(Array(6).fill(false));
  const [currentRow, setCurrentRow] = useState(0);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const statsSavedRef = useRef(false);

  // Load CSV and initialize puzzle
  useEffect(() => {
    async function initializeGame() {
      const loaded = await loadCountriesFromCSV();
      if (loaded && COUNTRIES.length > 0) {
        try {
          const now = new Date();
          const today = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;
          const stored = localStorage.getItem("witworld_puzzle_date");
          if (stored === today) {
            const p = localStorage.getItem("witworld_puzzle");
            if (p) {
              setPuzzle(JSON.parse(p));
              setLoading(false);
              return;
            }
          }
          const newPuzzle = getDailyPuzzle();
          localStorage.setItem("witworld_puzzle_date", today);
          localStorage.setItem("witworld_puzzle", JSON.stringify(newPuzzle));
          setPuzzle(newPuzzle);
        } catch (e) {
          console.error("Error initializing game:", e);
          setPuzzle(getDailyPuzzle());
        }
      }
      setLoading(false);
    }
    initializeGame();
  }, []);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const statsSavedRef = useRef(false);
  
  // Only destructure puzzle when it's loaded
  const country = puzzle?.country;
  const loc = puzzle?.loc;
  const { images, loading: imgLoading } = useWikiImages(loc?.[0] || "");

  // Load stats from localStorage
  const [stats, setStats] = useState(() => {
    try {
      const stored = localStorage.getItem("witworld_stats");
      return stored ? JSON.parse(stored) : { games: 0, wins: 0, guesses: [0, 0, 0, 0, 0, 0] };
    } catch {
      return { games: 0, wins: 0, guesses: [0, 0, 0, 0, 0, 0] };
    }
  });

  // Check if already played today's puzzle and restore guesses
  useEffect(() => {
    try {
      const now = new Date();
      const today = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;
      const played = localStorage.getItem("witworld_played_dates");
      const playedDates = played ? JSON.parse(played) : {};
      
      if (playedDates[today]) {
        setAlreadyPlayed(true);
        const result = playedDates[today];
        if (result.won) {
          setWon(true);
          setSubmitted(result.submitted);
          setGuesses(result.guesses || Array(6).fill(""));
        } else {
          setLost(true);
          setSubmitted(result.submitted);
          setGuesses(result.guesses || Array(6).fill(""));
        }
        statsSavedRef.current = true;
      }
    } catch (e) {
      console.error("Error checking played dates:", e);
    }
  }, []);

  // Save stats when game ends (only once)
  useEffect(() => {
    if ((won || lost) && !statsSavedRef.current) {
      statsSavedRef.current = true;
      
      const guessCount = submitted.findIndex(s => !s);
      // guessCount is 0-indexed position of first false, so it's the number of true values
      // If guessed on try 5: submitted = [true, true, true, true, true, false], guessCount = 5
      // We want to store in index 4 (0-4 = tries 1-5)
      const arrayIndex = guessCount === -1 ? 5 : guessCount - 1;
      
      const newStats = { ...stats, games: stats.games + 1 };
      if (won) {
        newStats.wins = stats.wins + 1;
        newStats.guesses[arrayIndex] = (newStats.guesses[arrayIndex] || 0) + 1;
      } else {
        newStats.guesses[5] = (newStats.guesses[5] || 0) + 1;
      }
      
      setStats(newStats);
      localStorage.setItem("witworld_stats", JSON.stringify(newStats));
      
      // Mark puzzle as played today with guesses
      try {
        const now = new Date();
        const today = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;
        const played = localStorage.getItem("witworld_played_dates");
        const playedDates = played ? JSON.parse(played) : {};
        playedDates[today] = { won, submitted, guesses };
        localStorage.setItem("witworld_played_dates", JSON.stringify(playedDates));
      } catch (e) {
        console.error("Error saving played date:", e);
      }
    }
  }, [won, lost]);

  function handleGuess(idx) {
    const guess = guesses[idx];
    if (!guess || submitted[idx]) return;
    const newSub = [...submitted];
    newSub[idx] = true;
    setSubmitted(newSub);
    if (guess === country.name) {
      setShowConfetti(true);
      setWon(true);
    } else if (idx === 5) {
      setLost(true);
    } else {
      setCurrentRow(idx + 1);
    }
  }

  function getHint(idx) {
    if (!submitted[idx] || guesses[idx] === country.name) return null;
    const gc = COUNTRIES.find(c => c.name === guesses[idx]);
    if (!gc) return null;
    const dist = Math.round(haversine(loc[1], loc[2], gc.cap[0], gc.cap[1]));
    const dir = bearing(gc.cap[0], gc.cap[1], loc[1], loc[2]);
    // Calculate percentage: max distance ~20000km (halfway around Earth)
    const maxDist = 20000;
    const percentage = Math.max(0, Math.round(100 - (dist / maxDist) * 100));
    return { dist, dir, percentage };
  }

  function shareResults() {
    const guessCount = submitted.findIndex(s => !s);
    const finalCount = guessCount === -1 ? 6 : guessCount + 1;
    
    // Build hints summary
    let hintsSummary = "";
    for (let i = 0; i < finalCount; i++) {
      if (submitted[i]) {
        const hint = getHint(i);
        if (hint) {
          const dirEmoji = hint.dir === "N" ? "⬆️" : hint.dir === "S" ? "⬇️" : hint.dir === "E" ? "➡️" : hint.dir === "W" ? "⬅️" :
                          hint.dir === "NE" ? "↗️" : hint.dir === "NW" ? "↖️" : hint.dir === "SE" ? "↘️" : "↙️";
          hintsSummary += `${dirEmoji} ${hint.percentage}%\n`;
        } else if (guesses[i] === country.name) {
          hintsSummary += `✓ Correct!\n`;
        }
      }
    }
    
    const text = `Where In The World? ${finalCount}/6 🎯\n\n${hintsSummary}\nPlay: https://witworld.vercel.app`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => alert(text));
  }

  const TYPE_LABELS = { capital: "🏛️ Capital", former: "🕰️ Former", city: "🌆 City", unicode: "🏛️ UNESCO", nature: "🌿 Nature" };
  const TYPE_COLORS = { capital: "#4ade80", former: "#fb923c", city: "#60a5fa", unicode: "#e879f9" };

  const typeColor = TYPE_COLORS[loc[3]];
  const typeLabel = TYPE_LABELS[loc[3]];

  return (
    <div style={{
      minHeight: "100vh", background: "#0f0f17", color: "#f8f8f2",
      fontFamily: "'Segoe UI', system-ui, sans-serif", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 16px 48px"
    }}>
      {loading ? (
        <div style={{ textAlign: "center", color: "#666" }}>
          <p>Loading game...</p>
        </div>
      ) : !puzzle ? (
        <div style={{ textAlign: "center", color: "#f87171" }}>
          <p>Error loading game. Please refresh.</p>
        </div>
      ) : (
      <div style={{
        minHeight: "100vh", background: "#0f0f17", color: "#f8f8f2",
        fontFamily: "'Segoe UI', system-ui, sans-serif", display: "flex",
        flexDirection: "column", alignItems: "center", padding: "24px 16px 48px", width: "100%"
      }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes confetti-fall {
          0% {
            transform: translateY(-10px) translateX(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(var(--tx)) rotate(360deg);
            opacity: 0;
          }
        }
        .confetti {
          position: fixed;
          pointer-events: none;
          animation: confetti-fall 3s ease-out forwards;
        }
      `}</style>

      {showConfetti && (
        <>
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                background: ['#5BCEFA', '#FFFFFF', '#F5A9B8'][Math.floor(Math.random() * 3)],
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
                '--tx': `${(Math.random() - 0.5) * 200}px`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
        </>
      )}

      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 36, fontWeight: 900, letterSpacing: -1, color: "#f8f8f2", marginBottom: 4 }}>
          where in the world?
        </h1>
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: 20, 
          marginBottom: 12,
          fontSize: 12,
          color: "#666"
        }}>
          <span>🏛️ capital</span>
          <span>🕰️ former</span>
          <span>🌆 city</span>
          <span>🏛️ unesco</span>
          <span>🌿 nature</span>
        </div>
        <p style={{ margin: 0, color: "#666", fontSize: 13 }}>
          guess the country
        </p>
      </div>

      <div style={{
        background: "linear-gradient(135deg, #1e1e2e, #16162a)",
        border: `1px solid ${typeColor}44`, borderRadius: 16,
        overflow: "hidden", marginBottom: 28, width: "100%", maxWidth: 520,
        boxShadow: `0 0 32px ${typeColor}22`
      }}>
        <ImageCarousel images={images} loading={imgLoading} />
        <div style={{ padding: "16px 24px 20px" }}>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5, color: "#f8f8f2", textAlign: "center" }}>
            {loc[0]}
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: "#888", textAlign: "center" }}>
            which country is this <span style={{ color: typeColor }}>{TYPE_LABELS[loc[3]]}</span> in?
          </div>
        </div>
      </div>

      <div style={{ width: "100%", maxWidth: 520, display: "flex", flexDirection: "column", gap: 10 }}>
        {Array.from({ length: 6 }, (_, i) => {
          const hint = getHint(i);
          const isActive = i === currentRow && !won && !lost;
          const isCorrect = submitted[i] && guesses[i] === country.name;
          const isWrong = submitted[i] && guesses[i] !== country.name;

          return (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", opacity: i > currentRow && !won && !lost ? 0.35 : 1 }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                background: isCorrect ? "#4ade80" : isWrong ? "#f87171" : isActive ? "#6366f1" : "#2a2a3e",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, color: "#fff"
              }}>
                {i + 1}
              </div>

              {(won || lost) && submitted[i] ? (
                <div style={{
                  flex: 1, padding: "10px 14px", borderRadius: 8, border: "1px solid #555",
                  background: "#1e1e2e", color: "#f8f8f2", fontSize: 14,
                  display: "flex", alignItems: "center"
                }}>
                  {guesses[i]}
                </div>
              ) : (
                <SearchDropdown
                  value={guesses[i]}
                  onChange={v => { const g = [...guesses]; g[i] = v; setGuesses(g); }}
                  disabled={!isActive || alreadyPlayed}
                  placeholder={isActive ? "Select…" : submitted[i] ? guesses[i] || "—" : "—"}
                />
              )}

              {isActive && !alreadyPlayed && (
                <button
                  onClick={() => handleGuess(i)}
                  disabled={!guesses[i]}
                  style={{
                    padding: "10px 16px", borderRadius: 8, border: "none",
                    background: guesses[i] ? "#6366f1" : "#2a2a3e",
                    color: "#fff", fontWeight: 700, fontSize: 13,
                    cursor: guesses[i] ? "pointer" : "not-allowed", flexShrink: 0,
                  }}
                >
                  Guess
                </button>
              )}

              {hint && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 5, flexShrink: 0,
                  background: "#1e1e2e", border: "1px solid #333", borderRadius: 8,
                  padding: "6px 10px", fontSize: 12, minWidth: 0
                }}>
                  <span>
                    {hint.dir === "N" ? "⬆️" : hint.dir === "S" ? "⬇️" : hint.dir === "E" ? "➡️" : hint.dir === "W" ? "⬅️" :
                     hint.dir === "NE" ? "↗️" : hint.dir === "NW" ? "↖️" : hint.dir === "SE" ? "↘️" : "↙️"}
                  </span>
                  <span style={{ 
                    fontWeight: 700, 
                    whiteSpace: "nowrap",
                    color: hint.percentage < 70 
                      ? `hsl(${hint.percentage * 1.2}, 100%, 50%)` 
                      : `hsl(${120 - (hint.percentage - 70) * 1.2}, 100%, 50%)`
                  }}>
                    {hint.percentage}% ({hint.dist}km)
                  </span>
                </div>
              )}

              {isCorrect && (
                <div style={{
                  flexShrink: 0, background: "#4ade8022", border: "1px solid #4ade80",
                  borderRadius: 8, padding: "6px 10px", fontSize: 12, color: "#4ade80", fontWeight: 700
                }}>✓</div>
              )}
            </div>
          );
        })}
      </div>

      {(won || lost) && (
        <div style={{
          marginTop: 28, width: "100%", maxWidth: 520,
          background: won ? "linear-gradient(135deg,#052e16,#14532d)" : "linear-gradient(135deg,#1c0a0a,#450a0a)",
          border: `1px solid ${won ? "#4ade80" : "#f87171"}`,
          borderRadius: 16, padding: "20px 24px", textAlign: "center"
        }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>{won ? "🎉" : "💡"}</div>
          <div style={{ fontWeight: 800, fontSize: 20, color: won ? "#4ade80" : "#f87171", marginBottom: 4 }}>
            {won ? (
              (() => {
                const guessCount = submitted.findIndex(s => !s);
                const finalCount = guessCount === -1 ? 6 : guessCount + 1;
                const messages = ["Perfect!", "Excellent!", "Great!", "Nice!", "Good!", "Phew!"];
                return messages[finalCount - 1] || "Perfect!";
              })()
            ) : "Better luck next time!"}
          </div>
          {lost && (
            <div style={{ color: "#aaa", marginBottom: 4, fontSize: 14 }}>
              The answer was <strong style={{ color: "#f8f8f2" }}>{country.name}</strong>
            </div>
          )}
          <div style={{ color: "#aaa", fontSize: 13, marginBottom: 16 }}>
            {loc[0]} is in <strong style={{ color: "#f8f8f2" }}>{country.name}</strong>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href={`https://simple.wikipedia.org/wiki/${loc[0].replace(/\s+/g, '_')}`}
              target="_blank" rel="noopener noreferrer"
              style={{
                padding: "10px 18px", borderRadius: 8,
                background: "#1d4ed8", color: "#fff", textDecoration: "none",
                fontWeight: 700, fontSize: 13
              }}
            >
              📖 Wikipedia: {loc[0]}
            </a>
            <button
              onClick={() => shareResults()}
              style={{
                padding: "10px 18px", borderRadius: 8,
                background: copied ? "#059669" : "#10b981", color: "#fff", border: "none",
                fontWeight: 700, fontSize: 13, cursor: "pointer"
              }}
            >
              {copied ? "✓ Copied!" : "📤 Share"}
            </button>
            <button
              onClick={() => {
                const newPuzzle = getRandomPuzzle();
                if (newPuzzle) {
                  setPuzzle(newPuzzle);
                  setGuesses(Array(6).fill(""));
                  setSubmitted(Array(6).fill(false));
                  setCurrentRow(0);
                  setWon(false);
                  setLost(false);
                }
              }}
              style={{
                padding: "10px 18px", borderRadius: 8,
                background: "#6366f1", color: "#fff", border: "none",
                fontWeight: 700, fontSize: 13, cursor: "pointer"
              }}
            >
              🎮 New Game
            </button>
          </div>
        </div>
      )}

      {(won || lost) && (
        <div style={{
          background: "linear-gradient(135deg, #1e1e2e, #16162a)",
          border: "1px solid #6366f1", borderRadius: 16,
          overflow: "hidden", marginTop: 28, width: "100%", maxWidth: 520,
          padding: "20px 24px"
        }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#f8f8f2" }}>Your Stats</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            <div style={{ background: "#111118", padding: 12, borderRadius: 8, textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#6366f1" }}>{stats.games}</div>
              <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>GAMES PLAYED</div>
            </div>
            <div style={{ background: "#111118", padding: 12, borderRadius: 8, textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#4ade80" }}>
                {stats.games > 0 ? Math.round((stats.wins / stats.games) * 100) : 0}%
              </div>
              <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>WIN RATE</div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#aaa", marginBottom: 8 }}>GUESS DISTRIBUTION</div>
            {[1, 2, 3, 4, 5, 6].map(i => {
              const count = stats.guesses[i - 1] || 0;
              const maxCount = Math.max(...stats.guesses, 1);
              const percent = maxCount > 0 ? (count / maxCount) * 100 : 0;
              return (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#aaa", width: 20 }}>{i}</span>
                  <div style={{
                    flex: 1, height: 20, background: "#1a1a1a", borderRadius: 4, overflow: "hidden"
                  }}>
                    <div style={{
                      width: `${percent}%`, height: "100%",
                      background: i === 1 ? "#4ade80" : i <= 3 ? "#60a5fa" : "#fb923c",
                      transition: "width 0.3s"
                    }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#aaa", width: 20, textAlign: "right" }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{
        marginTop: 48, textAlign: "center", color: "#444", fontSize: 12,
        letterSpacing: 2, fontWeight: 700
      }}>
        EVERY DAY A NEW GAME
      </div>
    </div>
      )}
    </div>
  );
}
