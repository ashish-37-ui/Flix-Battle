import { useEffect, useState } from "react";
import { getAllBattleStats } from "../utils/trends";
import { useNavigate } from "react-router-dom";

import "./Trends.css";

function Trends() {
  const [stats, setStats] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    setStats(getAllBattleStats());
  }, []);

  const mostVoted = [...stats]
    .sort((a, b) => b.totalVotes - a.totalVotes)
    .slice(0, 5);

  const categoryStats = stats.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + item.totalVotes;
    return acc;
  }, {});

  const trendingCategories = Object.entries(categoryStats).sort(
    (a, b) => b[1] - a[1]
  );

  const mostLikedOpinions = stats
    .flatMap((s) => s.opinions)
    .sort((a, b) => (b.likes || []).length - (a.likes || []).length)
    .slice(0, 5);

  const categoryIcons = {
    movies: "🎬",
    actors: "🎭",
    tv: "📺",
    singers: "🎵",
    custom: "✨",
  };

  return (
    <div className="trends-page">
      <h1>🔥 Trends</h1>

      {/* MOST VOTED */}
      <section className="trend-section">
        <h2>🏆 Most Voted Battles</h2>

        {mostVoted.length === 0 && (
          <p className="empty-state">No battles voted yet.</p>
        )}

        <div className="trend-grid">
          {mostVoted.map((b, i) => (
            <div
              key={i}
              className="trend-card clickable"
              onClick={() =>
                navigate(`/battle?type=${b.type}&index=${b.index}`)
              }
            >
              <div className="trend-tag">
                {categoryIcons[b.type]} {b.type.toUpperCase()}
              </div>
              <div className="trend-value">{b.totalVotes} votes</div>
            </div>
          ))}
        </div>
      </section>

      {/* 📊 TRENDING CATEGORIES */}
      <section className="trend-section">
        <h2>📊 Trending Categories</h2>

        {trendingCategories.length === 0 && (
          <p className="empty-state">No activity yet.</p>
        )}

        <div className="trend-grid">
          {mostVoted.map((b, i) => (
            <div
              key={i}
              className="trend-card clickable"
              onClick={() =>
                navigate(`/battle?type=${b.type}&index=${b.index}`)
              }
            >
              <div className="trend-tag">
                {categoryIcons[b.type]} {b.type.toUpperCase()}
              </div>
              <div className="trend-value">{b.totalVotes} votes</div>
            </div>
          ))}
        </div>
      </section>

      {/* TOP OPINIONS */}
      <section className="trend-section">
        <h2>💬 Top Opinions</h2>

        {mostLikedOpinions.length === 0 && (
          <p className="empty-state">No opinions yet.</p>
        )}

        <div className="trend-list">
          {mostLikedOpinions.map((op, i) => (
            <div key={i} className="opinion-card">
              <p className="opinion-text">“{op.text}”</p>
              <span className="opinion-likes">
                👍 {(op.likes || []).length}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Trends;
