import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import "./Battle.css";
import BattleHeader from "./BattleHeader";
import VoteSection from "./VoteSection";
import ResultsSection from "./ResultsSection";
import OpinionSection from "./OpinionSection";

function Battle() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const battleId = searchParams.get("battleId");

  const [battle, setBattle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🗳️ voting state
  const [hasVoted, setHasVoted] = useState(false);
  const [userVote, setUserVote] = useState(null);

  // 💬 opinion UI state
  const [opinionText, setOpinionText] = useState("");
  const [showOpinions, setShowOpinions] = useState(false);

  /* ---------------- FETCH BATTLE ---------------- */
  useEffect(() => {
    if (!battleId) {
      setError("No battle ID provided");
      setLoading(false);
      return;
    }

    const fetchBattle = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/battles/${battleId}?userId=frontend-user`
        );
        const data = await res.json();

        if (!data.success) {
          setError(data.message);
          setLoading(false);
          return;
        }

        setBattle({
          ...data.battle,
          votesA: data.votes.A,
          votesB: data.votes.B,
        });

        setHasVoted(!!data.userVote);
        setUserVote(data.userVote);
      } catch (err) {
        setError("Failed to load battle");
      } finally {
        setLoading(false);
      }
    };

    fetchBattle();
  }, [battleId]);

  /* ---------------- VOTE ---------------- */
  const vote = async (option) => {
    if (hasVoted) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/battles/${battle._id}/vote`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            option,
            userId: "frontend-user",
          }),
        }
      );

      const data = await res.json();
      if (!data.success) return;

      setBattle((prev) => ({
        ...prev,
        votesA: data.votes.A,
        votesB: data.votes.B,
      }));

      setHasVoted(true);
      setUserVote(option);
    } catch (err) {
      console.error("Vote failed", err);
    }
  };

  /* ---------------- SUBMIT OPINION ---------------- */
  const submitOpinion = async () => {
    if (!opinionText.trim()) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/battles/${battle._id}/opinion`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: "frontend-user",
            option: userVote,
            text: opinionText,
          }),
        }
      );

      const data = await res.json();
      if (!data.success) return;

      setBattle((prev) => ({
        ...prev,
        opinions: data.opinions,
      }));

      setOpinionText("");
    } catch (err) {
      console.error("Submit opinion failed", err);
    }
  };

  /* ---------------- LIKE OPINION ---------------- */
  const likeOpinion = async (opinionId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/battles/${battle._id}/opinion/${opinionId}/like`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: "frontend-user" }),
        }
      );

      const data = await res.json();
      if (!data.success) return;

      setBattle((prev) => ({
        ...prev,
        opinions: data.opinions,
      }));
    } catch (err) {
      console.error("Like opinion failed", err);
    }
  };

  if (loading) return <p className="loading">Loading battle…</p>;

  if (error) {
    return (
      <div className="battle-page not-found">
        <h1>😕 {error}</h1>
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  const totalVotes = battle.votesA + battle.votesB;
  const topOpinion =
    battle.opinions?.length > 0
      ? [...battle.opinions].sort(
          (a, b) => b.likes.length - a.likes.length
        )[0]
      : null;

  return (
    <div className="battle-page">
      <BattleHeader title={battle.title} />

      {/* 🗳️ VOTE */}
      <VoteSection
        optionA={battle.optionA}
        optionB={battle.optionB}
        hasVoted={hasVoted}
        onVoteA={() => vote("A")}
        onVoteB={() => vote("B")}
      />

      {/* 📊 RESULTS */}
      <ResultsSection
        optionA={battle.optionA}
        optionB={battle.optionB}
        votesA={battle.votesA}
        votesB={battle.votesB}
        percentA={
          totalVotes === 0 ? 0 : Math.round((battle.votesA / totalVotes) * 100)
        }
        percentB={
          totalVotes === 0 ? 0 : Math.round((battle.votesB / totalVotes) * 100)
        }
      />

      {/* 💬 OPINIONS */}
      <OpinionSection
        hasVoted={hasVoted}
        opinionText={opinionText}
        setOpinionText={setOpinionText}
        onSubmit={submitOpinion}
        opinions={battle.opinions || []}
        showOpinions={showOpinions}
        toggleOpinions={() => setShowOpinions((s) => !s)}
        likeOpinion={likeOpinion}
        userId="frontend-user"
        topOpinion={topOpinion}
      />
    </div>
  );
}

export default Battle;
