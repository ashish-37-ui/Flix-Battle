import { useEffect, useState } from "react";
import { getAllBattleStats } from "../utils/trends";
import "./Trends.css"

function Trends() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    setStats(getAllBattleStats());
  }, []);

  const mostVoted = [...stats]
    .sort((a, b) => b.totalVotes - a.totalVotes)
    .slice(0, 5);

  const mostLikedOpinions = stats
    .flatMap((s) => s.opinions)
    .sort((a, b) => (b.likes || []).length - (a.likes || []).length)
    .slice(0, 5);

  return (
    <div className="battle-page">
      <h1>🔥 Trends</h1>

      {/* MOST VOTED */}
      <section style={{ marginTop: "40px" }}>
        <h2>Most Voted Battles</h2>

        {mostVoted.length === 0 && <p>No data yet.</p>}

        {mostVoted.map((b, i) => (
          <div key={i} className="trend-item">
            <strong>{b.type.toUpperCase()}</strong> — {b.totalVotes} votes
          </div>
        ))}
      </section>

      {/* MOST LIKED OPINIONS */}
      <section style={{ marginTop: "60px" }}>
        <h2>Top Opinions</h2>

        {mostLikedOpinions.length === 0 && <p>No opinions yet.</p>}

        {mostLikedOpinions.map((op, i) => (
          <div key={i} className="trend-item">
            <p>{op.text}</p>
            <small>👍 {(op.likes || []).length} likes</small>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Trends;
