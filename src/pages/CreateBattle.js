import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateBattle.css";

function CreateBattle() {
  const navigate = useNavigate();

  const [type, setType] = useState("movies");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");

  const createBattle = () => {
  if (!optionA.trim() || !optionB.trim()) return;

  const raw = JSON.parse(localStorage.getItem("customBattles"));

  const stored = {
    movies: Array.isArray(raw?.movies) ? raw.movies : [],
    tv: Array.isArray(raw?.tv) ? raw.tv : [],
    actors: Array.isArray(raw?.actors) ? raw.actors : [],
    singers: Array.isArray(raw?.singers) ? raw.singers : [],
  };

  const newBattle = {
    id: Date.now(),
    title: "User Created Battle",
    optionA,
    optionB,
    type,
    source: "custom",
    createdAt: Date.now(),
  };

  // ✅ append
  stored[type].push(newBattle);

  // ✅ save
  localStorage.setItem("customBattles", JSON.stringify(stored));

  // 🔑 calculate correct index
  const staticCount =
    JSON.parse(localStorage.getItem("staticBattleCounts"))?.[type] || 0;

  const newIndex = staticCount + stored[type].length - 1;

  // ✅ navigate DIRECTLY to the created battle
  navigate(`/battle?type=${type}&index=${newIndex}`);
};


  return (
    <div className="create-page">
      <h1>Create a Battle</h1>
      <p className="subtitle">Compare anything and let the world decide.</p>

      {/* 🔘 TYPE SELECTOR */}
      <div className="type-selector">
        {[
          { key: "movies", label: "Movies 🎬" },
          { key: "actors", label: "Actors 🎭" },
          { key: "tv", label: "TV Series 📺" },
          { key: "singers", label: "Singers 🎵" },
        ].map((t) => (
          <button
            key={t.key}
            className={`type-btn ${type === t.key ? "active" : ""}`}
            onClick={() => setType(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 🆚 OPTIONS */}
      <div className="options-row">
        <div className="option-card">
          <label>Option A</label>
          <input
            placeholder="Enter first choice"
            value={optionA}
            onChange={(e) => setOptionA(e.target.value)}
          />
        </div>

        <div className="vs">VS</div>

        <div className="option-card">
          <label>Option B</label>
          <input
            placeholder="Enter second choice"
            value={optionB}
            onChange={(e) => setOptionB(e.target.value)}
          />
        </div>
      </div>

      <p className="helper-text">Example: Interstellar vs Inception</p>

      <button
        className="primary-btn create-btn"
        onClick={createBattle}
        disabled={!optionA.trim() || !optionB.trim()}
      >
        Start Battle 🔥
      </button>
    </div>
  );
}

export default CreateBattle;
