import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Trends.css";

function Trends() {
  const navigate = useNavigate();

  const [battles, setBattles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBattles = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/battles");
        const data = await res.json();

        if (data.success) {
          setBattles(data.battles);
        }
      } catch (err) {
        console.error("Failed to load trends");
      } finally {
        setLoading(false);
      }
    };

    fetchBattles();
  }, []);

  if (loading) {
    return <p className="empty-state">Loading trends…</p>;
  }

  // 🔥 Most voted
  const mostVoted = [...battles]
    .sort((a, b) => b.totalVotes - a.totalVotes)
    .slice(0, 5);

  // ⚡ Hot right now (recent + votes)
  const hotNow = [...battles]
    .filter((b) => b.totalVotes > 0)
    .sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt) ||
        b.totalVotes - a.totalVotes,
    )
    .slice(0, 5);

  // 🎬 Category-wise top battle
  const categories = ["movies", "actors", "tv", "singers"];
  const categoryTrends = categories.map(
    (cat) =>
      battles
        .filter((b) => b.type === cat)
        .sort((a, b) => b.totalVotes - a.totalVotes)[0],
  );

  const renderBattleCard = (b) => (
    <div
      key={b._id}
      className="battle-feed-card"
      onClick={() => navigate(`/battle?battleId=${b._id}`)}
    >
      <div className="feed-title">{b.title}</div>

      <div className="feed-options">
        <span>{b.optionA}</span>
        <strong>VS</strong>
        <span>{b.optionB}</span>
      </div>

      <div className="feed-meta">{b.totalVotes} votes</div>
    </div>
  );

  return (
    <div className="trends-page">
      <h1>🔥 Trends</h1>

      {/* 🔥 MOST VOTED */}
      <section>
        <h2>🔥 Most Voted Battles</h2>
        <div className="battle-feed">
          {mostVoted.length === 0 ? (
            <p className="empty-state">
              🔥 No votes yet. Vote on battles to shape what trends here.
            </p>
          ) : (
            mostVoted.map(renderBattleCard)
          )}
        </div>
      </section>

      {/* ⚡ HOT RIGHT NOW */}
      <section>
        <h2>⚡ Hot Right Now</h2>
        <div className="battle-feed">
          {hotNow.length === 0 ? (
            <p className="empty-state">
              ⚡ Nothing heating up yet. Recent votes will appear here.
            </p>
          ) : (
            hotNow.map(renderBattleCard)
          )}
        </div>
      </section>

      {/* 🎬 CATEGORY TRENDS */}
      <section>
        <h2>
          {" "}
          📊 Category trends will appear once battles start getting votes.
        </h2>
        <div className="battle-feed">
          {categoryTrends.map((b) => b && renderBattleCard(b))}
        </div>
      </section>
    </div>
  );
}

export default Trends;
