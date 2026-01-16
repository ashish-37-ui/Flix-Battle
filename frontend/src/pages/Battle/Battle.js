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

  // TEMP user identity (will come from auth later)
  const userId = "user1";

  const [battle, setBattle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Fetch battle (WITH user identity)
  useEffect(() => {
    if (!battleId) {
      setError("No battle ID provided");
      setLoading(false);
      return;
    }

    const fetchBattle = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/battles/${battleId}?userId=${userId}`
        );
        const data = await res.json();

        if (!data.success) {
          setError(data.message || "Battle not found");
          setLoading(false);
          return;
        }

        // ✅ Backend is source of truth
        setBattle({
          ...data.battle,
          votes: data.votes || { A: 0, B: 0 },
          userVote: data.userVote || null,
        });

        setLoading(false);
      } catch (err) {
        setError("Failed to load battle");
        setLoading(false);
      }
    };

    fetchBattle();
  }, [battleId]);

  // 🔹 Vote handler
  const vote = async (option) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/battles/${battle._id}/vote`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            option,
            userId,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) return;

      // ✅ Update from backend response only
      setBattle((prev) => ({
        ...prev,
        votes: data.votes,
        userVote: data.userVote,
      }));
    } catch (err) {
      console.error("Vote failed", err);
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

  // 🔹 SAFE vote derivation (no NaN possible)
  const votesA = battle?.votes?.A ?? 0;
  const votesB = battle?.votes?.B ?? 0;
  const totalVotes = votesA + votesB;

  const percentA =
    totalVotes === 0 ? 0 : Math.round((votesA / totalVotes) * 100);

  const percentB =
    totalVotes === 0 ? 0 : Math.round((votesB / totalVotes) * 100);

  const hasVoted = !!battle?.userVote;

  return (
    <div className="battle-page">
      <BattleHeader title={battle.title} />

      <VoteSection
        optionA={battle.optionA}
        optionB={battle.optionB}
        hasVoted={hasVoted}
        onVoteA={() => vote("A")}
        onVoteB={() => vote("B")}
      />

      <ResultsSection
        optionA={battle.optionA}
        optionB={battle.optionB}
        votesA={votesA}
        votesB={votesB}
        percentA={percentA}
        percentB={percentB}
      />

      <OpinionSection opinions={battle.opinions || []} />
    </div>
  );
}

export default Battle;
