import "./Battle.css";
import { useState } from "react";
import data from "../data/data";

function Battle() {
  const [votesA, setVotesA] = useState(10);
  const [votesB, setVotesB] = useState(8);

  const [currentIndex, setCurrentIndex] = useState(0);

  const battle = data[currentIndex];

  const totalVotes = votesA + votesB;

  const percentA =
    totalVotes === 0 ? 0 : ((votesA / totalVotes) * 100).toFixed(0);
  const percentB =
    totalVotes === 0 ? 0 : ((votesB / totalVotes) * 100).toFixed(0);

  const nextBattle = () => {
    const nextIndex = (currentIndex + 1) % data.length;
    setCurrentIndex(nextIndex);

    setVotesA(0);
    setVotesB(0);
  };

  return (
    <div className="battle-page">
      <h1>{battle.title}</h1>

      <p style={{ marginTop: "10px", color: "#555" }}>
       <div style={{marginBottom: "11px"}}>  Battle {currentIndex + 1} of {data.length}</div>
      </p>

      <div className="battle-area">
        <div className="battle-poster">{battle.optionA}</div>
        <div className="vs-text">VS</div>
        <div className="battle-poster">{battle.optionB}</div>
      </div>

      <div className="vote-buttons">
        <button onClick={() => setVotesA(votesA + 1)}>{battle.optionA}</button>
        <button onClick={() => setVotesB(votesB + 1)}>{battle.optionB}</button>
      </div>

      <div className="results">
        <strong>Live Results</strong>

        <div className="progress-container">
          <div className="progress-row">
            <div className="progress-label">
              {battle.optionA}: {percentA}% ({votesA} votes)
            </div>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: `${percentA}%` }}
              ></div>
            </div>
          </div>

          <div className="progress-row">
            <div className="progress-label">
              {battle.optionB}: {percentB}% ({votesB} votes)
            </div>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: `${percentB}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <button onClick={nextBattle}>Next Battle →</button>
      </div>
    </div>
  );
}

export default Battle;
