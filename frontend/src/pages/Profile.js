import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";

import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [createdBattles, setCreatedBattles] = useState([]);
  const [votedBattles, setVotedBattles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedBattles, setSavedBattles] = useState([]);

  const removeSavedBattle = async (battleId) => {
  try {
    const res = await fetch(
      `http://localhost:5000/api/battles/${battleId}/save`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          username: currentUser.username,
        }),
      }
    );

    const data = await res.json();

    if (data.success) {
      // 🔥 remove instantly from UI
      setSavedBattles((prev) =>
        prev.filter((b) => b._id !== battleId)
      );
    }
  } catch (err) {
    console.error("Failed to remove saved battle");
  }
};


  // 🔒 Guard: must be logged in
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const fetchActivity = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/users/${currentUser.id}/activity`,
        );
        const data = await res.json();

        if (data.success) {
          setCreatedBattles(data.createdBattles);
          setVotedBattles(data.votedBattles);
          setSavedBattles(data.savedBattles || []);
        }
      } catch (err) {
        console.error("Failed to load user activity");
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  return (
    <div className="profile-page">
      {/* 👤 HEADER */}
      <div className="profile-header">
        <h1>👤 {currentUser.username}</h1>
        <p>Your activity on FlixBattle</p>
      </div>

      {/* 🔥 CREATED BATTLES */}
      <section className="profile-section">
        <h2>🔥 Battles You Created</h2>

        {loading ? (
          <p className="empty-state">Loading...</p>
        ) : createdBattles.length === 0 ? (
          <p className="empty-state">You haven’t created any battles yet.</p>
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
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 🗳️ VOTED BATTLES */}
      <section className="profile-section">
        <h2>🗳️ Battles You Voted On</h2>

        {loading ? (
          <p className="empty-state">Loading...</p>
        ) : votedBattles.length === 0 ? (
          <p className="empty-state">You haven’t voted on any battles yet.</p>
        ) : (
          <div className="battle-feed">
            {votedBattles.map((b) => (
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
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ⭐ SAVED BATTLES */}
      <section className="profile-section">
        <h2>⭐ Saved Battles</h2>

        {loading ? (
          <p className="empty-state">Loading...</p>
        ) : savedBattles.length === 0 ? (
          <p className="empty-state">You haven’t saved any battles yet.</p>
        ) : (
          <div className="battle-feed">
            {savedBattles.map((b) => (
              <div key={b._id} className="battle-feed-card">
                {/* 🔹 Clickable battle area */}
                <div
                  className="battle-click"
                  onClick={() => navigate(`/battle?battleId=${b._id}`)}
                >
                  <div className="feed-title">{b.title}</div>
                  <div className="feed-options">
                    <span>{b.optionA}</span>
                    <strong>VS</strong>
                    <span>{b.optionB}</span>
                  </div>
                </div>

                {/* ❌ Remove saved button */}
                <button
                  className="remove-saved-btn"
                  onClick={() => removeSavedBattle(b._id)}
                >
                  ❌ Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Profile;
