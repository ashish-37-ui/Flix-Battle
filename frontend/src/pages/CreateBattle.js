import { useState } from "react";
import { useNavigate } from "react-router-dom";
import battleDataMap from "../data/battleData"; // ADD THIS AT TOP

import "./CreateBattle.css";

function CreateBattle() {
  const navigate = useNavigate();

  const [type, setType] = useState("movies");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");

  const createBattle = () => {
    if (!optionA.trim() || !optionB.trim()) return;

    // 🔑 Load existing custom battles safely
    const stored = JSON.parse(localStorage.getItem("customBattles")) || {
      movies: [],
      tv: [],
      actors: [],
      singers: [],
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

    // 🔑 Append battle to correct category
    stored[type].push(newBattle);

    localStorage.setItem("customBattles", JSON.stringify(stored));

    // 🔑 Navigate directly to this battle
    const defaultCount = battleDataMap[type]?.length || 0;
    const newIndex = defaultCount + stored[type].length - 1;

    navigate(`/battle?type=${type}&index=${newIndex}`);
  };

  return (
    <div className="create-page">
      <h1>Create a Battle</h1>
      <p className="subtitle">Pick two options and let the world decide.</p>

      {/* STEP 1 */}
      <h3 className="step-title">1️⃣ Choose Battle Type</h3>
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

      {/* STEP 2 */}
      <h3 className="step-title">2️⃣ Enter Options</h3>
      <div className="options-row">
        <div className="option-card">
          <label>Option A</label>
          <input
            placeholder="Option A (e.g. Interstellar)"
            value={optionA}
            onChange={(e) => setOptionA(e.target.value)}
            maxLength={40}
            autoFocus
          />
        </div>

        <div className="vs">VS</div>

        <div className="option-card">
          <label>Option B</label>
          <input
            placeholder="Option B (e.g. Inception)"
            value={optionB}
            onChange={(e) => setOptionB(e.target.value)}
            maxLength={40}
          />
        </div>
      </div>

      <p className="helper-text">Tip: Short names (1–3 words) work best</p>

      {/* PREVIEW */}
      {optionA && optionB && (
        <div className="battle-preview">
          <span>{optionA}</span>
          <strong>VS</strong>
          <span>{optionB}</span>
        </div>
      )}

      {/* STEP 3 */}
      <h3 className="step-title">3️⃣ Launch Battle</h3>
      <button
        className="primary-btn create-btn"
        onClick={createBattle}
        disabled={!optionA.trim() || !optionB.trim()}
      >
        {!optionA.trim() || !optionB.trim()
          ? "Enter both options to continue"
          : "Start Battle 🔥"}
      </button>
    </div>
  );
}

export default CreateBattle;
