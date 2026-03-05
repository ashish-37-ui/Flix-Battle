import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CreatorProfile.css";

function CreatorProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [createdBattles, setCreatedBattles] = useState([]);
  const [votedBattles, setVotedBattles] = useState([]);
  const [savedBattles, setSavedBattles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/users/${userId}/activity`
        );
        const data = await res.json();

        if (data.success) {
          setCreatedBattles(data.createdBattles || []);
          setVotedBattles(data.votedBattles || []);
          setSavedBattles(data.savedBattles || []);
        }
      } catch (err) {
        console.error("Failed to load creator activity");
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [userId]);

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading profile...</p>;
  }

  const totalBattles = createdBattles.length;
  const totalVotesReceived = createdBattles.reduce(
    (sum, b) => sum + (b.totalVotes || 0),
    0
  );

  console.log("createdBattles:", createdBattles);

 return (
  <div className="creator-profile-page">
    <div className="creator-header">
      <h1>👤 {userId}</h1>
      <p>Creator Profile</p>
    </div>

    <div className="creator-stats">
      <div className="stat-card">
        <strong>{createdBattles.length}</strong>
        <span>Battles Created</span>
      </div>

      <div className="stat-card">
        <strong>{votedBattles.length}</strong>
        <span>Battles Voted</span>
      </div>

      <div className="stat-card">
        <strong>{savedBattles.length}</strong>
        <span>Saved Battles</span>
      </div>
    </div>

    <section className="creator-section">
      <h2>🔥 Battles Created</h2>

      {createdBattles.length === 0 ? (
        <p>This creator has not created any battles yet.</p>
      ) : (
        <div className="battle-feed">
          {createdBattles.map((b) => (
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

              <div className="feed-meta">
                {b.totalVotes} votes
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  </div>
);
}

export default CreatorProfile;