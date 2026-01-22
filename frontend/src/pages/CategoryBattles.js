import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./CategoryBattles.css";

const CATEGORY_LABELS = {
  movies: "🎬 Movies",
  actors: "🎭 Actors",
  tv: "📺 TV Series",
  singers: "🎵 Singers",
};

function CategoryBattles() {
  const { type } = useParams(); // movies | actors | tv | singers
  const navigate = useNavigate();

  const [battles, setBattles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryBattles = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:5000/api/battles?type=${type}`,
        );
        const data = await res.json();

        if (data.success) {
          setBattles(data.battles);
        } else {
          setBattles([]);
        }
      } catch (err) {
        console.error("Failed to fetch category battles");
        setBattles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryBattles();
  }, [type]);

  

  return (
    <div className="category-page">
      {/* 🔹 HEADER */}
      <div className="category-header">
        <h1>{CATEGORY_LABELS[type] || "Battles"}</h1>
        <p>Vote, compare, and see what the world thinks.</p>
      </div>

      {/* 🔹 CONTENT */}
      {loading ? (
        <p className="empty-state">Loading battles…</p>
      ) : battles.length === 0 ? (
        <p className="empty-state">
          Create the first battle in this category and lead the conversation.
        </p>
      ) : (
        <div className="battle-feed">
          {battles.map((b) => (
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
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryBattles;
