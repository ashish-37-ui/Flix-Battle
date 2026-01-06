import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import battleDataMap from "../../data/battleData";
import "./Battle.css";

import { getBattleData, saveBattleData } from "../../utils/battleStorage";
import { getUserId } from "../../utils/user";
import { getCurrentUser } from "../../utils/auth";
import { getBattleByTypeAndIndex } from "../../utils/battleResolver";

import BattleHeader from "./BattleHeader";
import VoteSection from "./VoteSection";
import ResultsSection from "./ResultsSection";
import OpinionSection from "./OpinionSection";

function Battle() {
  /* -------------------- URL PARAMS -------------------- */
  const [searchParams, setSearchParams] = useSearchParams();

  const battleType = searchParams.get("type") || "movies";
  const urlIndex = Number(searchParams.get("index")) || 0;
  const genre = searchParams.get("genre");

  /* -------------------- USER -------------------- */
  const userId = getUserId();

  /* -------------------- BATTLE INDEX -------------------- */
  const [currentIndex, setCurrentIndex] = useState(urlIndex);


  /* -------------------- STATE -------------------- */
  const [votesA, setVotesA] = useState(0);
  const [votesB, setVotesB] = useState(0);
  const [opinions, setOpinions] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);

  const [opinionText, setOpinionText] = useState("");
  const [showOpinions, setShowOpinions] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  /* -------------------- DATA SOURCE -------------------- */
  const isCustom = battleType === "custom";
  const customBattle = JSON.parse(localStorage.getItem("customBattle"));

  const baseBattleData =
    isCustom && customBattle
      ? [customBattle]
      : battleDataMap[battleType] || battleDataMap.movies;

  const supportsGenre = battleType === "movies" || battleType === "tv";

  const battleData =
    supportsGenre && genre
      ? baseBattleData.filter((b) => b.genre === genre)
      : baseBattleData;

  const battle = getBattleByTypeAndIndex(battleType, currentIndex);
  const currentUser = getCurrentUser();

  useEffect(() => {
  setCurrentIndex(urlIndex);
}, [urlIndex]);


  /* -------------------- LOAD SAVED DATA -------------------- */
  useEffect(() => {
    const saved = getBattleData(`${battleType}-${currentIndex}`);

    if (saved) {
      setVotesA(saved.votesA);
      setVotesB(saved.votesB);
      setOpinions(saved.opinions || []);
      setHasVoted(saved.hasVoted);
    } else {
      setVotesA(0);
      setVotesB(0);
      setOpinions([]);
      setHasVoted(false);
    }

    setOpinionText("");
    setShowOpinions(false);
    setSelectedOption(null);
  }, [battleType, currentIndex]);

  /* -------------------- SAVE DATA -------------------- */
  useEffect(() => {
    saveBattleData(`${battleType}-${currentIndex}`, {
      votesA,
      votesB,
      opinions,
      hasVoted,
    });
  }, [votesA, votesB, opinions, hasVoted, battleType, currentIndex]);

  /* -------------------- SYNC INDEX IN URL -------------------- */
  useEffect(() => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("index", currentIndex);
      return params;
    });
  }, [currentIndex, setSearchParams]);

  /* -------------------- CALCULATIONS -------------------- */
  const totalVotes = votesA + votesB;

  const percentA =
    totalVotes === 0 ? 0 : ((votesA / totalVotes) * 100).toFixed(0);
  const percentB =
    totalVotes === 0 ? 0 : ((votesB / totalVotes) * 100).toFixed(0);

  const winner =
    votesA === votesB
      ? null
      : votesA > votesB
      ? battle.optionA
      : battle.optionB;

  const topOpinion =
    opinions.length === 0
      ? null
      : [...opinions].sort(
          (a, b) => (b.likes || []).length - (a.likes || []).length
        )[0];

  /* -------------------- ACTIONS -------------------- */
  const voteA = () => {
    if (hasVoted) return;
    setVotesA((v) => v + 1);
    setSelectedOption(battle.optionA);
    setHasVoted(true);
  };

  const voteB = () => {
    if (hasVoted) return;
    setVotesB((v) => v + 1);
    setSelectedOption(battle.optionB);
    setHasVoted(true);
  };

  const submitOpinion = () => {
    if (!opinionText.trim() || !selectedOption) return;

    setOpinions((prev) => [
      ...prev,
      {
        id: Date.now(),
        userId,
        option: selectedOption,
        text: opinionText,
        likes: [],
      },
    ]);

    setOpinionText("");
  };

  const likeOpinion = (opinionId) => {
    if (!currentUser) return;

    setOpinions((prev) =>
      prev.map((op) => {
        if (op.id !== opinionId) return op;
        if (op.userId === userId) return op;
        if ((op.likes || []).includes(userId)) return op;

        return {
          ...op,
          likes: [...(op.likes || []), userId],
        };
      })
    );
  };

  const nextBattle = () => {
  const nextIndex = (currentIndex + 1) % battleData.length;

  setSearchParams({
    type: battleType,
    index: nextIndex,
  });
};



  /* -------------------- RENDER -------------------- */
  if (!battle) return null;

  return (
    <div className="battle-page">
      <BattleHeader
        title={battle.title}
        current={currentIndex + 1}
        total={battleData.length}
      />

      {/* 🏷 Category */}
      <div style={{ color: "#94a3b8", marginBottom: "14px" }}>
        Category: <strong>{battleType}</strong>
      </div>

      {/* 🎯 GENRE FILTER */}
      {supportsGenre && (
        <div className="genre-filter">
          <button
            onClick={() =>
              setSearchParams((prev) => {
                const params = new URLSearchParams(prev);
                params.delete("genre");
                params.set("index", 0);
                return params;
              })
            }
          >
            All
          </button>

          {[...new Set(baseBattleData.map((b) => b.genre))]
            .filter(Boolean)
            .map((g) => (
              <button
                key={g}
                onClick={() =>
                  setSearchParams((prev) => {
                    const params = new URLSearchParams(prev);
                    params.set("genre", g);
                    params.set("index", 0);
                    return params;
                  })
                }
              >
                {g.toUpperCase()}
              </button>
            ))}
        </div>
      )}

      {/* 🆚 BATTLE */}
      <div className="battle-area">
        <div
          className={`battle-poster ${
            winner === battle.optionA ? "winner" : ""
          }`}
        >
          {battle.optionA}
        </div>

        <div className="vs-text">VS</div>

        <div
          className={`battle-poster ${
            winner === battle.optionB ? "winner" : ""
          }`}
        >
          {battle.optionB}
        </div>
      </div>

      <VoteSection
        optionA={battle.optionA}
        optionB={battle.optionB}
        hasVoted={hasVoted}
        onVoteA={voteA}
        onVoteB={voteB}
      />

      {currentUser ? (
        <OpinionSection
          hasVoted={hasVoted}
          opinionText={opinionText}
          setOpinionText={setOpinionText}
          onSubmit={submitOpinion}
          opinions={opinions}
          showOpinions={showOpinions}
          toggleOpinions={() => setShowOpinions(!showOpinions)}
          likeOpinion={likeOpinion}
          userId={currentUser.id}
          topOpinion={topOpinion}
        />
      ) : (
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <p style={{ color: "#94a3b8" }}>
            Login to share your opinion and like others.
          </p>
          <a href="/login">Login</a>
        </div>
      )}

      <ResultsSection
        optionA={battle.optionA}
        optionB={battle.optionB}
        votesA={votesA}
        votesB={votesB}
        percentA={percentA}
        percentB={percentB}
      />

      <div style={{ marginTop: "40px" }}>
        <button onClick={nextBattle}>Next Battle →</button>
      </div>
    </div>
  );
}

export default Battle;
