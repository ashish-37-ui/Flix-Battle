import { useState, useEffect } from "react";
import { useSearchParams , useNavigate  } from "react-router-dom";

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
  /* ---------------- URL PARAMS ---------------- */
  const [searchParams, setSearchParams] = useSearchParams();
  const battleType = searchParams.get("type") || "movies";
  const urlIndex = Number(searchParams.get("index")) || 0;
  const genre = searchParams.get("genre");

  /* ---------------- USER ---------------- */
  const userId = getUserId();
  const currentUser = getCurrentUser();
  const navigate = useNavigate();


  /* ---------------- INDEX ---------------- */
  const [currentIndex, setCurrentIndex] = useState(urlIndex);

  /* ---------------- STATE ---------------- */
  const [votesA, setVotesA] = useState(0);
  const [votesB, setVotesB] = useState(0);
  const [opinions, setOpinions] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);

  const [opinionText, setOpinionText] = useState("");
  const [showOpinions, setShowOpinions] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  /* 🔥 micro-interaction */
  const [showVoteConfirm, setShowVoteConfirm] = useState(false);

  /* ---------------- DATA ---------------- */
  const customBattles = JSON.parse(localStorage.getItem("customBattles")) || {};

  const baseData = [
    ...(battleDataMap[battleType] || []),
    ...(customBattles[battleType] || []),
  ];

  const supportsGenre = battleType === "movies" || battleType === "tv";

  const battleData =
    supportsGenre && genre
      ? baseData.filter((b) => b.genre === genre)
      : baseData;

  const battle = battleData[currentIndex];
  const battleId = searchParams.get("battleId");

  useEffect(() => {
    if (battleId) {
      const foundIndex = battleData.findIndex(
        (b) => String(b.id) === String(battleId)
      );

      if (foundIndex !== -1) {
        setCurrentIndex(foundIndex);
        return;
      }
    }

    // fallback to index from URL
    setCurrentIndex(urlIndex);
  }, [battleId, urlIndex, battleData]);

  /* ---------------- LOAD SAVED DATA ---------------- */
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

  /* ---------------- SAVE DATA ---------------- */
  useEffect(() => {
    saveBattleData(`${battleType}-${currentIndex}`, {
      votesA,
      votesB,
      opinions,
      hasVoted,
    });
  }, [votesA, votesB, opinions, hasVoted, battleType, currentIndex]);

  /* ---------------- CALCULATIONS ---------------- */
  const totalVotes = votesA + votesB;

  const percentA =
    totalVotes === 0 ? 0 : ((votesA / totalVotes) * 100).toFixed(0);
  const percentB =
    totalVotes === 0 ? 0 : ((votesB / totalVotes) * 100).toFixed(0);

  const winner =
    votesA === votesB
      ? null
      : votesA > votesB
      ? battle?.optionA
      : battle?.optionB;

  const topOpinion =
    opinions.length === 0
      ? null
      : [...opinions].sort(
          (a, b) => (b.likes || []).length - (a.likes || []).length
        )[0];

  /* ---------------- ACTIONS ---------------- */
  const voteA = () => {
    if (hasVoted) return;
    setVotesA((v) => v + 1);
    setSelectedOption(battle.optionA);
    setHasVoted(true);
    setShowVoteConfirm(true);
    setTimeout(() => setShowVoteConfirm(false), 2000);
  };

  const voteB = () => {
    if (hasVoted) return;
    setVotesB((v) => v + 1);
    setSelectedOption(battle.optionB);
    setHasVoted(true);
    setShowVoteConfirm(true);
    setTimeout(() => setShowVoteConfirm(false), 2000);
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

  const likeOpinion = (id) => {
    if (!currentUser) return;

    setOpinions((prev) =>
      prev.map((op) => {
        if (op.id !== id) return op;
        if (op.userId === userId) return op;
        if (op.likes.includes(userId)) return op;

        return { ...op, likes: [...op.likes, userId] };
      })
    );
  };

  const nextBattle = () => {
    const nextIndex = (currentIndex + 1) % battleData.length;
    setSearchParams({ type: battleType, index: nextIndex });
  };

  /* ---------------- RENDER ---------------- */
  if (!battle) {
    return (
      <div className="battle-page not-found">
        <h1>😕 Battle not found</h1>
        <p>This battle may have been removed or is no longer available.</p>

        <button onClick={() => navigate("/")}>Go back home</button>
      </div>
    );
  }

  return (
    <div className="battle-page">
      <BattleHeader
        title={battle.title}
        current={currentIndex + 1}
        total={battleData.length}
      />

      <div className="battle-area">
        <div
          className={`battle-poster ${
            selectedOption === battle.optionA ? "selected" : ""
          } ${winner === battle.optionA ? "winner" : ""}`}
        >
          {battle.optionA}
        </div>

        <div className="vs-text">VS</div>

        <div
          className={`battle-poster ${
            selectedOption === battle.optionB ? "selected" : ""
          } ${winner === battle.optionB ? "winner" : ""}`}
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

      {showVoteConfirm && (
        <div className="vote-confirm">✅ Your vote has been counted</div>
      )}

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
        <p className="login-hint">Login to share opinions and like others.</p>
      )}

      <ResultsSection
        optionA={battle.optionA}
        optionB={battle.optionB}
        votesA={votesA}
        votesB={votesB}
        percentA={percentA}
        percentB={percentB}
      />

      <button className="next-btn" onClick={nextBattle}>
        Next Battle <span>→</span>
      </button>
    </div>
  );
}

export default Battle;
