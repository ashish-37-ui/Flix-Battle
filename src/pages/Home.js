import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home">

      {/* HERO */}
      <div className="hero">
        <h1>Choose. Vote. Set the Trend.</h1>
        <p>Vote between movies, singers & pop culture icons.</p>

        <div className="hero-buttons">
          <button>Start Voting</button>
          <button>Explore Battles</button>
        </div>
      </div>

      {/* BATTLE OF THE DAY */}
      <div className="section">
        <h2>Battle of the Day</h2>

        <div className="battle-preview">
          <div className="poster">Poster A</div>
          <div className="vs">VS</div>
          <div className="poster">Poster B</div>
        </div>

        <Link to="/battle">
          <button>Vote Now</button>
        </Link>
      </div>

      {/* TRENDING */}
      <div className="section">
        <h2>Trending Battles</h2>

        <div className="trending">
          <div className="card">Battle 1</div>
          <div className="card">Battle 2</div>
          <div className="card">Battle 3</div>
          <div className="card">Battle 4</div>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="section">
        <h2>Categories</h2>

        <div className="categories">
          <div className="category">Movies</div>
          <div className="category">Singers</div>
          <div className="category">Series</div>
          <div className="category">Characters</div>
          <div className="category">Directors</div>
          <div className="category">OTT</div>
        </div>
      </div>

    </div>
  );
}

export default Home;
