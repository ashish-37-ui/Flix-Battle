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
        setActivity((prev) => {
  if (JSON.stringify(prev) === JSON.stringify(data.activity)) {
    return prev;
  }
  return data.activity;
});
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
        {activity.map((a, index) => (
          
<div
  key={a._id}
  className="activity-card"
  onClick={() => navigate(`/battle?battleId=${a.battleId}`)}
  style={{ animationDelay: `${index * 0.08}s` }}
>
  <div className="activity-left">

    <div className="activity-icon">
      {a.type === "battle" && "🆕"}
      {a.type === "vote" && "🗳"}
      {a.type === "opinion" && "💬"}
      {a.type === "reply" && "↩"}
      {a.type === "like" && "❤️"}
    </div>

    <div className="activity-content">

      <div className="activity-action">
        <strong>{a.username}</strong>

        {a.type === "battle" && " created a battle"}
        {a.type === "vote" && " voted"}
        {a.type === "opinion" && " posted an opinion"}
        {a.type === "reply" && " replied"}
        {a.type === "like" && " liked an opinion"}
      </div>

      <div className="activity-battle">
        {a.battleTitle}
      </div>

    </div>

  </div>

  <div className="activity-time">
    {timeAgo(a.createdAt)}
  </div>

</div>


        ))}
      </div>
    </section>
  );
}

export default LiveActivity;
