import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";
import { useRef } from "react";
import LiveActivity from "../components/LiveActivity";

//import Skeleton from "../components/Skeleton";

import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const searchRef = useRef(null);

  const [battles, setBattles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);

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

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/users/leaderboard/top",
        );
        const data = await res.json();

        if (data.success) {
          setLeaderboard(data.leaderboard);
        }
      } catch (err) {
        console.error("Failed to load leaderboard");
      }
    };

    fetchLeaderboard();
  });

  const popularBattles = [...battles]
    .sort((a, b) => b.totalVotes - a.totalVotes)
    .slice(0, 5);

  const spotlightBattle =
    battles.find((b) => b.isFeatured) || popularBattles[0];

  const recentBattles = [...battles]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const mostDebatedBattles = [...battles]
    .sort((a, b) => (b.opinionCount || 0) - (a.opinionCount || 0))
    .slice(0, 5);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      const res = await fetch(
        `http://localhost:5000/api/battles?q=${encodeURIComponent(query)}`,
      );
      const data = await res.json();

      if (data.success) {
        setSearchResults(data.battles);
        setTimeout(() => {
          searchRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    } catch (err) {
      console.error("Search failed");
    } finally {
      setSearching(false);
    }
  };

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

      {spotlightBattle && (
        <section className="spotlight-battle">
          <div
            className={`spotlight-card ${
              spotlightBattle.isFeatured ? "daily" : ""
            }`}
            onClick={() => navigate(`/battle?battleId=${spotlightBattle._id}`)}
          >
            <div className="spotlight-badge">
              {spotlightBattle.isFeatured
                ? "🥇 Battle of the Day"
                : "🔥 Trending Battle"}
            </div>

            <h2 className="spotlight-title">{spotlightBattle.title}</h2>

            <div className="spotlight-options">
              <span>{spotlightBattle.optionA}</span>
              <strong>VS</strong>
              <span>{spotlightBattle.optionB}</span>
            </div>

            <div className="spotlight-meta">
              🗳 {spotlightBattle.totalVotes} votes
            </div>
          </div>
        </section>
      )}

      <section className="search-section">
        <form onSubmit={handleSearch} className="search-bar">
          <div className="search-input-wrapper">
            <input
              placeholder="Search battles (movies, actors, shows...)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            {query && (
              <button
                type="button"
                className="clear-search"
                onClick={() => {
                  setQuery("");
                  setSearchResults([]);
                }}
              >
                ✕
              </button>
            )}
          </div>

          <button type="submit">Search</button>
        </form>
      </section>

      {query && (
        <section className="search-results" ref={searchRef}>
          <h2>🔍 Search Results</h2>

          {searching ? (
            <p className="empty-state">Searching…</p>
          ) : searchResults.length === 0 ? (
            <p className="empty-state">No battles found.</p>
          ) : (
            <div className="battle-feed search-feed">
              {searchResults.map((b) => (
                <div
                  key={b._id}
                  className="battle-feed-card"
                  onClick={() => navigate(`/battle?battleId=${b._id}`)}
                >
                  <div className="feed-title">
                    {highlightMatch(b.title, query)}
                  </div>

                  <div className="feed-options">
                    <span>{highlightMatch(b.optionA, query)}</span>
                    <strong>VS</strong>
                    <span>{highlightMatch(b.optionB, query)}</span>
                  </div>

                  <div className="feed-meta">{b.totalVotes} votes</div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

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

      <LiveActivity />

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
                className="battle-feed-card poster-card"
                onClick={() => navigate(`/battle?battleId=${b._id}`)}
              >
                <div className="poster-container">
                  {b.posterA && <img src={b.posterA} alt={b.optionA} />}

                  <div className="vs-overlay">VS</div>

                  {b.posterB && <img src={b.posterB} alt={b.optionB} />}
                </div>

                <div className="battle-info">
                  <div className="feed-title">{b.title}</div>

                  <div className="battle-meta">
                    🗳 {b.totalVotes} votes • 💬 {b.opinionCount}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="most-debated">
        <h2 className="section-title">💬 Most Debated</h2>

        <div className="battle-feed">
          {mostDebatedBattles.map((b) => (
            <div
              key={b._id}
              className="battle-feed-card poster-card"
              onClick={() => navigate(`/battle?battleId=${b._id}`)}
            >
              <div className="poster-container">
                {b.posterA && <img src={b.posterA} alt={b.optionA} />}

                <div className="vs-overlay">VS</div>

                {b.posterB && <img src={b.posterB} alt={b.optionB} />}
              </div>

              <div className="battle-info">
                <div className="feed-title">{b.title}</div>

                <div className="battle-meta">
                  🗳 {b.totalVotes} votes • 💬 {b.opinionCount}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="leaderboard-section">
        <h2 className="section-title">🏆 Top Creators</h2>

        <div className="leaderboard-list">
          {leaderboard.map((user, index) => (
            <div
              key={user.userId}
              className="leaderboard-card clickable"
              onClick={() => navigate(`/creator/${user.userId}`)}
            >
              <div className="rank">#{index + 1}</div>
              <div className="creator-name ">{user.username}</div>
              <div className="creator-stats">
                🔥 {user.score} pts • 🗳 {user.totalVotes} votes • 💬{" "}
                {user.totalOpinions}
              </div>
            </div>
          ))}
        </div>
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
                className="battle-feed-card poster-card"
                onClick={() => navigate(`/battle?battleId=${b._id}`)}
              >
                <div className="poster-container">
                  {b.posterA && <img src={b.posterA} alt={b.optionA} />}

                  <div className="vs-overlay">VS</div>

                  {b.posterB && <img src={b.posterB} alt={b.optionB} />}
                </div>

                <div className="battle-info">
                  <div className="feed-title">{b.title}</div>

                  <div className="battle-meta">
                    🗳 {b.totalVotes} votes • 💬 {b.opinionCount}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ✨ CREATE */}
    </>
  );
}

function highlightMatch(text, query) {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, "ig");
  const parts = text.split(regex);

  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={index} className="highlight">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export default Home;
