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
  const [feedback, setFeedback] = useState(null);

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
    if (!currentUser) {
      navigate("/login", {
        state: { from: location.pathname + location.search },
      });
      return;
    }

    if (hasVoted) {
      showFeedback("⚠️ You already voted on this battle", "warning");
      return;
    }

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
        },
      );

      const data = await res.json();
      if (!data.success) {
        showFeedback(data.message || "You already voted", "warning");
        return;
      }

      setBattle((prev) => ({
        ...prev,
        votesA: data.votes.A,
        votesB: data.votes.B,
      }));

      setHasVoted(true);
      setUserVote(option);

      showFeedback("✅ Vote recorded", "success");
    } catch {
      showFeedback("Something went wrong", "warning");
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

      // ❌ Backend rejected opinion (already posted, etc.)
      if (!data.success) {
        showFeedback(data.message || "Opinion already submitted", "warning");
        return;
      }

      // ✅ Opinion accepted
      setBattle((prev) => ({
        ...prev,
        opinions: data.opinions,
      }));

      setOpinionText("");

      showFeedback("💬 Opinion posted", "success");
    } catch (err) {
      showFeedback("Failed to submit opinion", "warning");
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

  const shareBattle = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showFeedback("🔗 Battle link copied", "success");
    } catch {
      showFeedback("Failed to copy link", "warning");
    }
  };

  const showFeedback = (message, type = "success") => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 3000);
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

  if (!battleId) {
    return (
      <div className="battle-page not-found">
        <h1>😕 Battle not found</h1>
        <p>This battle link is invalid or expired.</p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="primary-btn"
        >
          Go Home
        </button>
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
      {feedback && (
        <div className={`feedback ${feedback.type}`}>{feedback.message}</div>
      )}
      <BattleHeader title={battle.title} />

      {feedback && (
        <div className={`feedback ${feedback.type}`}>{feedback.message}</div>
      )}

      <div className="battle-actions">
        <button className="secondary-btn" onClick={shareBattle}>
          🔗 Share Battle
        </button>
      </div>

      <div className="share-actions">
        <button
          className="share-btn whatsapp"
          onClick={() =>
            window.open(
              `https://wa.me/?text=${encodeURIComponent(window.location.href)}`,
              "_blank",
            )
          }
        >
          WhatsApp
        </button>

        <button
          className="share-btn twitter"
          onClick={() =>
            window.open(
              `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                window.location.href,
              )}`,
              "_blank",
            )
          }
        >
          X
        </button>
      </div>

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

      {hasVoted &&
        battle.opinions.some((op) => op.userId === currentUser?.id) && (
          <p className="empty-state">
            ✅ You’ve already shared your opinion on this battle.
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
