import { Link, useNavigate } from "react-router-dom";
import { getPopularBattles } from "../utils/discovery";
import { useEffect, useState } from "react";

import "./Home.css";
import battleDataMap from "../data/battleData";
import { getBattleOfTheDay } from "../utils/battleOfTheDay";
import { getCurrentUser } from "../utils/auth";
import { getRecentBattles } from "../utils/discovery";

function Home() {
  const navigate = useNavigate();

  // Pick movies as default for now
  const todayBattle = getBattleOfTheDay(battleDataMap.movies);

  const currentUser = getCurrentUser();

  const [popularBattles, setPopularBattles] = useState([]);
  const [recentBattles, setRecentBattles] = useState([]);

  useEffect(() => {
    setPopularBattles(getPopularBattles());
  }, []);

  useEffect(() => {
    setRecentBattles(getRecentBattles());
  }, []);

  return (
    <>
      <div className="home-page">
        {/* 🔥 HERO SECTION */}
        <section className="home-hero">
          <h1>
            Pick a side.
            <br />
            <span>Defend your choice.</span>
          </h1>

          <p>
            Vote between iconic movies, actors, TV shows, or anything. Share
            your opinion and see what the world thinks.
          </p>

          <button
            className="primary-btn hero-btn"
            onClick={() =>
              document
                .querySelector(".battle-type-section")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Choose a Battle Type ↓
          </button>
        </section>
      </div>
      {/* 🔥 BATTLE OF THE DAY */}
      {todayBattle && (
        <section className="battle-of-day">
          <h2>🔥 Battle of the Day</h2>

          <div
            className="battle-of-day-card"
            onClick={() => navigate("/battle?type=movies")}
          >
            <div className="battle-title">{todayBattle.title}</div>
            <div className="battle-options">
              <span>{todayBattle.optionA}</span>
              <strong>VS</strong>
              <span>{todayBattle.optionB}</span>
            </div>
          </div>
        </section>
      )}

      {/* 🔥 POPULAR BATTLES */}
      <section className="popular-battles">
        <h2>🔥 Popular Battles</h2>

        {popularBattles.length === 0 ? (
          <p className="empty-state">
            No battles trending yet. Start voting to shape trends 🔥
          </p>
        ) : (
          <div className="battle-feed">
            {popularBattles.map((b, i) => (
              <div
                key={i}
                className="battle-feed-card"
                onClick={() =>
                  navigate(`/battle?type=${b.type}&battleId=${b.id}`)
                }
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

      {/* ✨ RECENT BATTLES */}
      <section className="recent-battles">
        <h2>✨ Recently Created</h2>

        {recentBattles.length === 0 ? (
          <p className="empty-state">
            No custom battles yet. Be the first to create one! 🚀
          </p>
        ) : (
          <div className="battle-feed">
            {recentBattles.map((b, i) => (
              <div
                key={i}
                className="battle-feed-card"
                onClick={() =>
                  navigate(`/battle?type=${b.type}&battleId=${b.id}`)
                }
              >
                <span className="new-badge">NEW</span>

                <div className="feed-title">{b.title}</div>

                <div className="feed-options">
                  <span>{b.optionA}</span>
                  <strong>VS</strong>
                  <span>{b.optionB}</span>
                </div>

                <div className="feed-meta">Created just now</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ✨ CREATE CUSTOM BATTLE */}
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

      <section className="battle-type-section">
        <h2 className="section-title">What do you want to battle?</h2>

        <div className="battle-types">
          <div
            className="battle-type-card"
            onClick={() => navigate("/battle?type=movies")}
          >
            🎬
            <span>Movies</span>
          </div>

          <div
            className="battle-type-card"
            onClick={() => navigate("/battle?type=actors")}
          >
            🎭
            <span>Actors</span>
          </div>

          <div
            className="battle-type-card"
            onClick={() => navigate("/battle?type=tv")}
          >
            📺
            <span>TV Series</span>
          </div>

          <div
            className="battle-type-card"
            onClick={() => navigate("/battle?type=singers")}
          >
            🎵
            <span>Singers</span>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
