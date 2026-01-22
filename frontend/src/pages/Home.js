import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";
//import Skeleton from "../components/Skeleton";


import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

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
        console.error("Failed to fetch battles");
      } finally {
        setLoading(false);
      }
    };

    fetchBattles();
  }, []);

  const popularBattles = [...battles]
    .sort((a, b) => b.totalVotes - a.totalVotes)
    .slice(0, 5);

  const recentBattles = [...battles]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <>
      {/* 🔥 HERO */}
      <section className="home-hero">
        <h1>
          Pick a side.
          <br />
          <span>Defend your choice.</span>
        </h1>

        <p>
          Vote between iconic movies, actors, TV shows, or anything. Share your
          opinion and see what the world thinks.
        </p>
        <button
          className="hero-scroll-btn"
          onClick={() =>
            document
              .getElementById("battle-categories")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Choose a Battle Type ↓
        </button>
      </section>

      {/* 🎯 CATEGORIES (MOVED UP) */}
      <section id="battle-categories" className="battle-type-section">
        <h2 className="section-title">Choose a Battle Category</h2>

        <div className="battle-types">
          <div
            className="battle-type-card"
            onClick={() => navigate("/category/movies")}
          >
            🎬
            <span>Movies</span>
          </div>

          <div
            className="battle-type-card"
            onClick={() => navigate("/category/actors")}
          >
            🎭
            <span>Actors</span>
          </div>

          <div
            className="battle-type-card"
            onClick={() => navigate("/category/tv")}
          >
            📺
            <span>TV Series</span>
          </div>

          <div
            className="battle-type-card"
            onClick={() => navigate("/category/singers")}
          >
            🎵
            <span>Singers</span>
          </div>
        </div>
      </section>

       <section className="create-battle">
        <h2>Create Your Own Battle</h2>
        <p>Pick any two things and let people decide.</p>

        <button
          className="primary-btn"
          onClick={() => {
            if (!currentUser) {
              navigate("/login");
            } else {
              navigate("/create");
            }
          }}
        >
          Create a Battle ✨
        </button>
      </section>

      {/* 🔥 POPULAR */}
      <section className="popular-battles">
        <h2>🔥 Popular Battles</h2>

        {loading ? (
          <p className="empty-state">Loading battles…</p>
        ) : popularBattles.length === 0 ? (
          <p className="empty-state">
            No battles trending yet. Start voting to shape trends 🔥
          </p>
        ) : (
          <div className="battle-feed">
            {popularBattles.map((b) => (
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
      </section>

      {/* ✨ RECENT */}
      <section className="recent-battles">
        <h2>✨ Recently Created</h2>

        {loading ? (
          <p className="empty-state">Loading battles…</p>
        ) : recentBattles.length === 0 ? (
          <p className="empty-state">
            ✨ No community battles yet. Create one and kickstart the debate.
          </p>
        ) : (
          <div className="battle-feed">
            {recentBattles.map((b) => (
              <div
                key={b._id}
                className="battle-feed-card"
                onClick={() => navigate(`/battle?battleId=${b._id}`)}
              >
                <span className="new-badge">NEW</span>

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
      </section>

      {/* ✨ CREATE */}
     
    </>
  );
}

export default Home;
