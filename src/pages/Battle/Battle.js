import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import battleDataMap from "../../data/battleData";
import "./Battle.css";

import { getBattleData, saveBattleData } from "../../utils/battleStorage";
import { getUserId } from "../../utils/user";
import { getCurrentUser } from "../../utils/auth";

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
  const currentUser = getCurrentUser();

  /* -------------------- INDEX -------------------- */
  const [currentIndex, setCurrentIndex] = useState(urlIndex);

  useEffect(() => {
    setCurrentIndex(urlIndex);
  }, [urlIndex]);

  /* -------------------- STATE -------------------- */
  const [votesA, setVotesA] = useState(0);
  const [votesB, setVotesB] = useState(0);
  const [opinions, setOpinions] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);

  const [opinionText, setOpinionText] = useState("");
  const [showOpinions, setShowOpinions] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  /* -------------------- CUSTOM + STATIC BATTLES -------------------- */
  const rawCustom = JSON.parse(localStorage.getItem("customBattles")) || {};

  const customBattles = {
    movies: Array.isArray(rawCustom.movies) ? rawCustom.movies : [],
    tv: Array.isArray(rawCustom.tv) ? rawCustom.tv : [],
    actors: Array.isArray(rawCustom.actors) ? rawCustom.actors : [],
    singers: Array.isArray(rawCustom.singers) ? rawCustom.singers : [],
  };

  const staticBattles = battleDataMap[battleType] || [];
  const mergedBattles = [...staticBattles, ...customBattles[battleType]];

  const supportsGenre = battleType === "movies" || battleType === "tv";

  const battleData =
    supportsGenre && genre
      ? mergedBattles.filter((b) => b.genre === genre)
      : mergedBattles;

  const battle = battleData[currentIndex];

  const battleId = searchParams.get("battleId");

  useEffect(() => {
  if (!battleId || !battleData.length) return;

  const foundIndex = battleData.findIndex(
    (b) => String(b.id) === String(battleId)
  );

  if (foundIndex !== -1) {
    setCurrentIndex(foundIndex);
  }
}, [battleId, battleData]);



  /* -------------------- LOAD DATA (ON BATTLE CHANGE ONLY) -------------------- */
  useEffect(() => {
    if (!battle) return;

    const saved = getBattleData(`${battleType}-${battle.id}`);

    setVotesA(saved?.votesA ?? 0);
    setVotesB(saved?.votesB ?? 0);
    setOpinions(saved?.opinions ?? []);
    setHasVoted(saved?.hasVoted ?? false);

    setOpinionText("");
    setShowOpinions(false);
    setSelectedOption(null);
  }, [battle?.id, battleType]);

  useEffect(() => {
  const counts = {};
  Object.keys(battleDataMap).forEach((type) => {
    counts[type] = battleDataMap[type]?.length || 0;
  });
  localStorage.setItem("staticBattleCounts", JSON.stringify(counts));
}, []);


  /* -------------------- CALCULATIONS -------------------- */
  if (!battle) {
    return (
      <div className="battle-page">
        <h1>Battle not found</h1>
      </div>
    );
  }

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

  /* -------------------- ACTIONS (SAVE HERE, NOT IN useEffect) -------------------- */
  const voteA = () => {
    if (hasVoted) return;

    const newVotesA = votesA + 1;
    setVotesA(newVotesA);
    setSelectedOption(battle.optionA);
    setHasVoted(true);

    saveBattleData(`${battleType}-${battle.id}`, {
      votesA: newVotesA,
      votesB,
      opinions,
      hasVoted: true,
    });
  };

  const voteB = () => {
    if (hasVoted) return;

    const newVotesB = votesB + 1;
    setVotesB(newVotesB);
    setSelectedOption(battle.optionB);
    setHasVoted(true);

    saveBattleData(`${battleType}-${battle.id}`, {
      votesA,
      votesB: newVotesB,
      opinions,
      hasVoted: true,
    });
  };

  const submitOpinion = () => {
    if (!opinionText.trim() || !selectedOption) return;

    const updatedOpinions = [
      ...opinions,
      {
        id: Date.now(),
        userId,
        option: selectedOption,
        text: opinionText,
        likes: [],
      },
    ];

    setOpinions(updatedOpinions);
    setOpinionText("");

    saveBattleData(`${battleType}-${battle.id}`, {
      votesA,
      votesB,
      opinions: updatedOpinions,
      hasVoted,
    });
  };

  const likeOpinion = (opinionId) => {
    if (!currentUser) return;

    const updatedOpinions = opinions.map((op) => {
      if (op.id !== opinionId) return op;
      if (op.userId === userId) return op;
      if ((op.likes || []).includes(userId)) return op;

      return {
        ...op,
        likes: [...(op.likes || []), userId],
      };
    });

    setOpinions(updatedOpinions);

    saveBattleData(`${battleType}-${battle.id}`, {
      votesA,
      votesB,
      opinions: updatedOpinions,
      hasVoted,
    });
  };

  const nextBattle = () => {
    const nextIndex = (currentIndex + 1) % battleData.length;

    setSearchParams({
      type: battleType,
      index: nextIndex,
      ...(genre ? { genre } : {}),
    });
  };

  /* -------------------- RENDER -------------------- */
  return (
    <div className="battle-page">
      <BattleHeader
        title={battle.title}
        current={currentIndex + 1}
        total={battleData.length}
      />

      <div style={{ color: "#94a3b8", marginBottom: "14px" }}>
        Category: <strong>{battleType}</strong>
      </div>

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
