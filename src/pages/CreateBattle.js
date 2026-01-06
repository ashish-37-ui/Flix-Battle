import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateBattle() {
  const navigate = useNavigate();

  const [type, setType] = useState("custom");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");

  const createBattle = () => {
  if (!optionA.trim() || !optionB.trim()) return;

  const existingBattles =
    JSON.parse(localStorage.getItem("customBattles")) || [];

  const newBattle = {
    title: "User Created Battle",
    optionA,
    optionB,
    type, // "custom", "movies", etc.
    id: Date.now(), // 🔑 unique battle id
 // 🔑 position matters
    createdAt: Date.now(),         // 🔑 for "recent"
  };

  localStorage.setItem(
    "customBattles",
    JSON.stringify([...existingBattles, newBattle])
  );

  // 👉 Go directly to the new battle
  navigate(`/battle?type=${type}&index=${newBattle.index}`);
};


  return (
    <div className="battle-page">
      <h1>Create a Battle</h1>

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="custom">Anything</option>
        <option value="movies">Movies</option>
        <option value="actors">Actors</option>
        <option value="tv">TV Series</option>
        <option value="singers">Singers</option>
      </select>

      <input
        placeholder="Option A"
        value={optionA}
        onChange={(e) => setOptionA(e.target.value)}
      />

      <input
        placeholder="Option B"
        value={optionB}
        onChange={(e) => setOptionB(e.target.value)}
      />

      <button onClick={createBattle}>
        Start Battle 🔥
      </button>
    </div>
  );
}

export default CreateBattle;
