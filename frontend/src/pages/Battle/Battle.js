import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../utils/auth";
import { useLocation } from "react-router-dom";
import Skeleton from "../../components/Skeleton";


import "./Battle.css";
import BattleHeader from "./BattleHeader";
import VoteSection from "./VoteSection";
import ResultsSection from "./ResultsSection";
import OpinionSection from "./OpinionSection";

function Battle() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const battleId = searchParams.get("battleId");
  const currentUser = getCurrentUser();
  const userId = currentUser?.id || null;
  const location = useLocation();

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
          `http://localhost:5000/api/battles/${battleId}?userId=${userId}`,
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
  }, [battleId, userId]);

  console.log("Current user:", getCurrentUser());

  /* ---------------- VOTE ---------------- */
  const vote = async (option) => {
  // 🔒 Not logged in
  if (!currentUser) {
    alert("Please log in to vote on this battle.");

    navigate("/login", {
      state: { from: location.pathname + location.search },
    });
    return;
  }

  // 🔒 Already voted — HARD STOP
  if (hasVoted) {
  return; // silent no-op (UX-friendly)
}

  // 🗳️ Proceed with vote
  try {
    const res = await fetch(
      `http://localhost:5000/api/battles/${battle._id}/vote`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          option,
          userId: currentUser.id,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok || !data.success) {
      alert(data.message || "Vote failed");
      return;
    }

    setBattle((prev) => ({
      ...prev,
      votesA: data.votes.A,
      votesB: data.votes.B,
    }));

    setHasVoted(true);
    setUserVote(option);

    alert("Your vote has been recorded.");
  } catch (err) {
    console.error("Vote failed", err);
    alert("Something went wrong while voting.");
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
            userId: currentUser.id,
            option: userVote,
            text: opinionText,
          }),
        },
      );

      const data = await res.json();
      if (!data.success) return;

      setBattle((prev) => ({
        ...prev,
        opinions: data.opinions,
      }));

      setOpinionText("");
      alert("Your opinion has been posted.");
    } catch (err) {
      console.error("Submit opinion failed", err);
    }
  };

  /* ---------------- LIKE OPINION ---------------- */
  const likeOpinion = async (opinionId) => {
    if (!currentUser) {
      navigate("/login", {
        state: { from: location.pathname + location.search },
      });

      return;
    }

    if (hasVoted) {
    return;
  }
    try {
      const res = await fetch(
        `http://localhost:5000/api/battles/${battle._id}/opinion/${opinionId}/like`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: currentUser.id }),
        },
      );

      const data = await res.json();
      if (!data.success) {
  alert(data.message || "Failed to submit opinion");
  return;
}

      setBattle((prev) => ({
        ...prev,
        opinions: data.opinions,
      }));
    } catch (err) {
      console.error("Like opinion failed", err);
    }
  };

  if (loading) {
  return (
    <div className="battle-page">
      <Skeleton height={32} width="70%" style={{ marginBottom: 20 }} />

      <Skeleton height={48} style={{ marginBottom: 12 }} />
      <Skeleton height={48} style={{ marginBottom: 24 }} />

      <Skeleton height={20} width="40%" style={{ marginBottom: 8 }} />
      <Skeleton height={12} />
      <Skeleton height={12} />
    </div>
  );
}


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
      ? [...battle.opinions].sort((a, b) => b.likes.length - a.likes.length)[0]
      : null;

  return (
    <div className="battle-page">
      <BattleHeader title={battle.title} />

      {/* 🗳️ VOTE */}
      <VoteSection
        optionA={battle.optionA}
        optionB={battle.optionB}
        hasVoted={hasVoted}
        userVote={userVote}
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

      {hasVoted && battle.opinions.length === 0 && (
        <p className="empty-state">
          💬 No opinions yet. Be the first to share why you chose this.
        </p>
      )}

      {/* 💬 OPINIONS */}
      <OpinionSection
        hasVoted={hasVoted}
         currentUser={currentUser}
        opinionText={opinionText}
        setOpinionText={setOpinionText}
        onSubmit={submitOpinion}
        opinions={battle.opinions || []}
        showOpinions={showOpinions}
        toggleOpinions={() => setShowOpinions((s) => !s)}
        likeOpinion={likeOpinion}
        userId={userId}
        topOpinion={topOpinion}
      />
    </div>
  );
}

export default Battle;
