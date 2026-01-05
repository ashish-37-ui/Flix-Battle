import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    };

    localStorage.setItem("customBattle", JSON.stringify(battle));
    navigate("/battle?type=custom");
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
