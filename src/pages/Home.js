import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import battleDataMap from "../data/battleData";
import { getBattleOfTheDay } from "../utils/battleOfTheDay";

function Home() {
  const navigate = useNavigate();

  // Pick movies as default for now
  const todayBattle = getBattleOfTheDay(battleDataMap.movies);

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

      {/* ✨ CREATE CUSTOM BATTLE */}
      <section className="create-battle">
        <h2>Create Your Own Battle</h2>
        <p>Pick any two things and let people decide.</p>

        <button className="primary-btn" onClick={() => navigate("/create")}>
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
