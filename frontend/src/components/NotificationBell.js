
import { useEffect, useState } from "react";
import { getCurrentUser } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import "./NotificationBell.css";

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!currentUser) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/notifications/${currentUser.id}`
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

  const unreadCount = notifications.filter((n) => !n.read).length;

  const openNotification = async (notification) => {
    try {
      await fetch(
        `http://localhost:5000/api/notifications/${notification._id}/read`,
        { method: "POST" }
      );

      navigate(notification.link);
    } catch {
      navigate(notification.link);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="notification-wrapper">
      <div
        className="notification-bell"
        onClick={() => setOpen(!open)}
      >
        🔔
        {unreadCount > 0 && (
          <span className="notification-count">
            {unreadCount}
          </span>
        )}
      </div>

      {open && (
        <div className="notification-dropdown">
          <div className="notification-title">
            Notifications
          </div>

          {notifications.length === 0 ? (
            <p className="empty-notifications">
              No notifications yet
            </p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`notification-item ${
                  n.read ? "" : "unread"
                }`}
                onClick={() => openNotification(n)}
              >
                {n.message}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
