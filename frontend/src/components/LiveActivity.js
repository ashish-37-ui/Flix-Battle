import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LiveActivity.css";

function LiveActivity() {
  const [activity, setActivity] = useState([]);
  const navigate = useNavigate();

  const fetchActivity = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/activity");
      const data = await res.json();

      if (data.success) {
        setActivity(data.activity);
      }
    } catch {
      console.error("Failed to load activity");
    }
  };

  useEffect(() => {
    fetchActivity();

    const interval = setInterval(() => {
      fetchActivity();
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const timeAgo = (date) => {
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);

    if (seconds < 60) return "just now";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return minutes + "m ago";

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return hours + "h ago";

    return Math.floor(hours / 24) + "d ago";
  };

  return (
    <section className="live-activity">
      <h2>🔥 Live Activity</h2>

      <div className="activity-list">
        {activity.map((a) => (
          <div
            key={a._id}
            className="activity-item"
            onClick={() => navigate(`/battle?battleId=${a.battleId}`)}
          >
            <div className="activity-text">
              <span className="activity-line">
                {a.type === "battle" && "🆕 "}
                {a.type === "vote" && "🗳 "}
                {a.type === "opinion" && "💬 "}
                {a.type === "reply" && "↩ "}
                {a.type === "like" && "❤️ "}

                <strong>{a.username}</strong>
              </span>

              <div className="activity-battle">{a.battleTitle}</div>
            </div>

            <div className="activity-time">{timeAgo(a.createdAt)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default LiveActivity;
