import { useEffect, useState, useRef } from "react";
import { getCurrentUser } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import "./NotificationBell.css";


function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);

  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return minutes + "m ago";

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours + "h ago";

  const days = Math.floor(hours / 24);
  return days + "d ago";
}



function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const bellRef = useRef(null);

  useEffect(() => {
    if (!currentUser) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/notifications/${encodeURIComponent(currentUser.id)}`,
        );

        const data = await res.json();

        if (data.success) {
          setNotifications(data.notifications);
        }
      } catch (err) {
        console.error("Failed to fetch notifications");
      }
    };

    fetchNotifications();
  }, [currentUser]);

  // ⭐ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const openNotification = async (notification) => {
    try {
      await fetch(
        `http://localhost:5000/api/notifications/${notification._id}/read`,
        { method: "POST" },
      );

      navigate(notification.link);
      setOpen(false);
    } catch {
      navigate(notification.link);
      setOpen(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="notification-wrapper" ref={bellRef}>
      <div className="notification-bell" onClick={() => setOpen(!open)}>
        🔔
        {unreadCount > 0 && (
          <span className="notification-count">{unreadCount}</span>
        )}
      </div>

      {open && (
        <div className="notification-dropdown">
          <div className="notification-title">Notifications</div>

          {notifications.length === 0 ? (
            <p className="empty-notifications">No notifications yet</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`notification-item ${n.read ? "" : "unread"}`}
                onClick={() => openNotification(n)}
              >
                <div className="notification-text">{n.message}</div>

                <div className="notification-time">{timeAgo(n.createdAt)}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
