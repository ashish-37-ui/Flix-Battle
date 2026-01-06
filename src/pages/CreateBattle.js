import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateBattle.css";

function CreateBattle() {
  const navigate = useNavigate();

  const [type, setType] = useState("custom");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");

  const createBattle = () => {
    if (!optionA.trim() || !optionB.trim()) return;

    const battle = {
      title: "User Created Battle",
      optionA,
      optionB,
      type: "custom",
    };

    localStorage.setItem(
      "activeCustomBattle",
      JSON.stringify(battle)
    );

    navigate("/battle?type=custom");
  };

  return (
    <div className="create-page">
      <h1>Create a Battle</h1>
      <p className="subtitle">
        Compare anything and let the world decide.
      </p>

      {/* 🔘 TYPE SELECTOR */}
      <div className="type-selector">
        {[
          { key: "custom", label: "Anything ✨" },
          { key: "movies", label: "Movies 🎬" },
          { key: "actors", label: "Actors 🎭" },
          { key: "tv", label: "TV Series 📺" },
          { key: "singers", label: "Singers 🎵" },
        ].map((t) => (
          <button
            key={t.key}
            className={`type-btn ${
              type === t.key ? "active" : ""
            }`}
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

      <p className="helper-text">
        Example: Interstellar vs Inception
      </p>

      {/* 🔥 CTA */}
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
