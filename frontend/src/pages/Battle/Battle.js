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

  useEffect(() => {
    if (!battleId) {
      setError("No battle ID provided");
      setLoading(false);
      return;
    }

    const fetchBattle = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/battles/${battleId}`
        );
        const data = await res.json();

        if (!data.success) {
          setError(data.message);
          setLoading(false);
          return;
        }

        setBattle(data.battle);
        setLoading(false);
      } catch (err) {
        setError("Failed to load battle");
        setLoading(false);
      }
    };

    fetchBattle();
  }, [battleId]);

  const vote = async (option) => {
    await fetch(
      `http://localhost:5000/api/battles/${battle._id}/vote`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ option }),
      }
    );

    setBattle((prev) => ({
      ...prev,
      votesA: option === "A" ? prev.votesA + 1 : prev.votesA,
      votesB: option === "B" ? prev.votesB + 1 : prev.votesB,
    }));
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

  return (
    <div className="battle-page">
      <BattleHeader title={battle.title} />

      <VoteSection
        optionA={battle.optionA}
        optionB={battle.optionB}
        onVoteA={() => vote("A")}
        onVoteB={() => vote("B")}
      />

      <ResultsSection
        optionA={battle.optionA}
        optionB={battle.optionB}
        votesA={battle.votesA}
        votesB={battle.votesB}
        percentA={
          battle.votesA + battle.votesB === 0
            ? 0
            : Math.round(
                (battle.votesA /
                  (battle.votesA + battle.votesB)) *
                  100
              )
        }
        percentB={
          battle.votesA + battle.votesB === 0
            ? 0
            : Math.round(
                (battle.votesB /
                  (battle.votesA + battle.votesB)) *
                  100
              )
        }
      />

      <OpinionSection opinions={battle.opinions || []} />
    </div>
  );
}

export default Battle;
