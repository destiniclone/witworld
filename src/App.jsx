import { useState, useMemo, useRef, useEffect } from "react";

// Simple hardcoded capitals for testing
const COUNTRIES = [
  { name: "Afghanistan", wiki: "Afghanistan", cap: [34.5281, 69.1723], locs: [["Kabul", 34.5281, 69.1723, "capital"]] },
  { name: "Albania", wiki: "Albania", cap: [41.3317, 19.8319], locs: [["Tirana", 41.3317, 19.8319, "capital"]] },
  { name: "Algeria", wiki: "Algeria", cap: [36.7372, 3.0865], locs: [["Algiers", 36.7372, 3.0865, "capital"]] },
  { name: "Argentina", wiki: "Argentina", cap: [-34.6037, -58.3816], locs: [["Buenos Aires", -34.6037, -58.3816, "capital"]] },
  { name: "Australia", wiki: "Australia", cap: [-35.2835, 149.1281], locs: [["Canberra", -35.2835, 149.1281, "capital"]] },
  { name: "Austria", wiki: "Austria", cap: [48.2082, 16.3738], locs: [["Vienna", 48.2082, 16.3738, "capital"]] },
  { name: "Brazil", wiki: "Brazil", cap: [-15.7795, -47.9297], locs: [["Brasília", -15.7795, -47.9297, "capital"]] },
  { name: "Canada", wiki: "Canada", cap: [45.4215, -75.6972], locs: [["Ottawa", 45.4215, -75.6972, "capital"]] },
  { name: "China", wiki: "China", cap: [39.9042, 116.4074], locs: [["Beijing", 39.9042, 116.4074, "capital"]] },
  { name: "France", wiki: "France", cap: [48.8566, 2.3522], locs: [["Paris", 48.8566, 2.3522, "capital"]] },
  { name: "Germany", wiki: "Germany", cap: [52.5200, 13.4050], locs: [["Berlin", 52.5200, 13.4050, "capital"]] },
  { name: "India", wiki: "India", cap: [28.7041, 77.1025], locs: [["New Delhi", 28.7041, 77.1025, "capital"]] },
  { name: "Japan", wiki: "Japan", cap: [35.6762, 139.6503], locs: [["Tokyo", 35.6762, 139.6503, "capital"]] },
  { name: "Mexico", wiki: "Mexico", cap: [19.4326, -99.1332], locs: [["Mexico City", 19.4326, -99.1332, "capital"]] },
  { name: "Russia", wiki: "Russia", cap: [55.7558, 37.6173], locs: [["Moscow", 55.7558, 37.6173, "capital"]] },
  { name: "South Africa", wiki: "South_Africa", cap: [-25.7479, 28.2293], locs: [["Pretoria", -25.7479, 28.2293, "capital"]] },
  { name: "United Kingdom", wiki: "United_Kingdom", cap: [51.5074, -0.1278], locs: [["London", 51.5074, -0.1278, "capital"]] },
  { name: "United States", wiki: "United_States", cap: [38.9072, -77.0369], locs: [["Washington D.C.", 38.9072, -77.0369, "capital"]] },
];

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
        const mapKeywords = /map|locate|position|geography|diagram|chart|flag|coat of arms|infobox|location map|administrative/i;
        
        for (const img of images_list.slice(0, 15)) {
          const imgTitle = img.title;
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

export default function WITWorld() {
  const [puzzle, setPuzzle] = useState(() => getDailyPuzzle());
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

  const { country, loc } = puzzle;
  const { images, loading: imgLoading } = useWikiImages(loc[0]);

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
    const maxDist = 20000;
    const percentage = Math.max(0, Math.round(100 - (dist / maxDist) * 100));
    return { dist, dir, percentage };
  }

  function shareResults() {
    const guessCount = submitted.findIndex(s => !s);
    const finalCount = guessCount === -1 ? 6 : guessCount + 1;
    
    let hintsSummary = "";
    for (let i = 0; i < finalCount; i++) {
      if (submitted[i]) {
        const hint = getHint(i);
        if (hint) {
          const dirEmoji = hint.dir === "N" ? "⬆️" : hint.dir === "S" ? "⬇️" : hint.dir === "E" ? "➡️" : hint.dir === "W" ? "⬅️" :
                          hint.dir === "NE" ? "↗️" : hint.dir === "NW" ? "↖️" : hint.dir === "SE" ? "↘️" : "↙️";
          hintsSummary += `${dirEmoji} ${hint.percentage}%\n`;
        }
      }
    }

    const result = won ? `${finalCount}/6 🎯` : `${finalCount}/6 ❌`;
    const text = `Where In The World? ${result}\n\n${hintsSummary}\nPlay: https://witworld.vercel.app`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#0f0f17", color: "#f8f8f2",
      fontFamily: "'Segoe UI', system-ui, sans-serif", display: "flex",
      flexDirection: "column", alignItems: "center", padding: "24px 16px 48px"
    }}>
      <div style={{ maxWidth: 520, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 8px 0" }}>where in the world?</h1>
          <p style={{ fontSize: 13, color: "#666", margin: 0 }}>guess the country</p>
        </div>

        <div style={{ marginBottom: 24, minHeight: 300, background: "#1a1a25", borderRadius: 8, overflow: "hidden" }}>
          {imgLoading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, color: "#666" }}>
              Loading image...
            </div>
          ) : images.length > 0 ? (
            <img
              src={images[0]}
              alt="Location"
              style={{ width: "100%", height: 300, objectFit: "cover" }}
            />
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, color: "#666" }}>
              No image available
            </div>
          )}
        </div>

        <div style={{ marginBottom: 24 }}>
          {guesses.map((guess, idx) => (
            <input
              key={idx}
              type="text"
              list={`countries-${idx}`}
              value={guess}
              onChange={e => {
                const newGuesses = [...guesses];
                newGuesses[idx] = e.target.value;
                setGuesses(newGuesses);
              }}
              onKeyDown={e => {
                if (e.key === "Enter" && guess && !submitted[idx]) {
                  handleGuess(idx);
                }
              }}
              disabled={submitted[idx] || won || lost}
              placeholder="Type country name..."
              style={{
                width: "100%",
                padding: "12px 16px",
                marginBottom: 8,
                border: "1px solid #2a2a3e",
                borderRadius: 8,
                background: "#1a1a25",
                color: "#f8f8f2",
                fontSize: 14,
              }}
            />
          ))}
        </div>

        <button
          onClick={() => {
            if (!won && !lost && currentRow < 6) {
              handleGuess(currentRow);
            }
          }}
          disabled={won || lost}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 8,
            background: "#6366f1",
            color: "#fff",
            border: "none",
            fontWeight: 700,
            cursor: "pointer",
            marginBottom: 24
          }}
        >
          Submit Guess
        </button>

        {(won || lost) && (
          <div style={{ textAlign: "center", padding: 16, background: "#1a1a25", borderRadius: 8 }}>
            <p style={{ fontSize: 16, fontWeight: 700, margin: "0 0 8px 0" }}>
              {won ? "🎉 You won!" : "😢 Game over!"}
            </p>
            <p style={{ fontSize: 14, color: "#666", margin: 0 }}>
              The answer was: <strong>{country.name}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
