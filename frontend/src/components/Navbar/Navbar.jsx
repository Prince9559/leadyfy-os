import { Bell, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getNotifications } from "../../services/notificationService";

import "./Navbar.css";

function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadUnreadNotifications = async () => {
      try {
        const data = await getNotifications();

        const notifications =
          data?.notifications || [];

        const userId =
          user?._id || user?.id || "guest";

        const storageKey =
          `leadyfy_viewed_notifications_${userId}`;

        const viewedNotifications = JSON.parse(
          localStorage.getItem(storageKey) || "[]"
        );

        const unread = notifications.filter(
          (notification) =>
            notification.isRead === false &&
            !viewedNotifications.includes(
              notification._id
            )
        );

        setUnreadCount(unread.length);
      } catch (error) {
        console.error(
          "Failed to load notification count:",
          error
        );
      }
    };

    loadUnreadNotifications();
  }, [location.pathname, user]);

  const handleNotifications = () => {
    navigate("/notifications");
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h2 className="navbar-title">
          Leadyfy OS
        </h2>
      </div>

      <div className="navbar-right">
        <button
          type="button"
          className="navbar-icon-button notification-bell-button"
          aria-label="Notifications"
          onClick={handleNotifications}
        >
          <Bell size={20} />

          {unreadCount > 0 && (
            <span className="notification-count-badge">
              {unreadCount > 99
                ? "99+"
                : unreadCount}
            </span>
          )}
        </button>

        <div className="navbar-user">
          <UserCircle size={32} />

          <div className="navbar-user-info">
            <span className="navbar-user-name">
              {user?.name || "User"}
            </span>

            <span className="navbar-user-role">
              {user?.role || "Employee"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;