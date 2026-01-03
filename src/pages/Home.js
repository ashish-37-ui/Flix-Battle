import { Link, useNavigate} from "react-router-dom";
import "./Home.css";

function Home() {

  const navigate = useNavigate();

  return (
    <>
     <div className="home-page">
      {/* 🔥 HERO SECTION */}
      <section className="home-hero">
        <h1>Pick a side.</h1>
        <h2>Defend your choice.</h2>

        <p>
          Vote between iconic movies, share your opinion,
          and discover what the world thinks.
        </p>

        <Link to="/battle">
          <button className="primary-btn hero-btn">
            Start a Battle 🔥
          </button>
        </Link>
      </section>
    </div>
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
