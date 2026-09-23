import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Edit } from "lucide-react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  getNotificationById,
  markNotificationAsRead,
} from "../../services/notificationService";

import "./Notifications.css";

function NotificationView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotification = async () => {
      try {
        const data = await getNotificationById(id);

        let currentNotification = data.notification;

        // Mark unread notification as read
        if (
          currentNotification &&
          currentNotification.isRead === false
        ) {
          try {
            const readData =
              await markNotificationAsRead(id);

            currentNotification =
              readData.notification ||
              {
                ...currentNotification,
                isRead: true,
              };
          } catch (readError) {
            console.error(
              "Mark notification as read error:",
              readError
            );
          }
        }

        setNotification(currentNotification);
      } catch (error) {
        console.error(
          "Get notification error:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to load notification"
        );
      } finally {
        setLoading(false);
      }
    };

    loadNotification();
  }, [id]);

  const formatType = (type) => {
    const types = {
      task: "Task",
      order: "Order",
      script: "Script",
      shoot: "Shoot",
      video: "Video",
      payment: "Payment",
      support: "Support",
      system: "System",
      other: "Other",
    };

    return types[type] || type || "-";
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatDateTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  if (loading) {
    return (
      <div className="notifications-page">
        <div className="notifications-empty">
          <p>Loading notification...</p>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
        />
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="notifications-page">
        <div className="notifications-header">
          <div>
            <h1>Notification Details</h1>

            <p>
              Notification information could not
              be found.
            </p>
          </div>

          <button
            type="button"
            className="notification-back-button"
            onClick={() =>
              navigate("/notifications")
            }
          >
            Back
          </button>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
        />
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div>
          <h1>Notification Details</h1>

          <p>
            View complete information about this
            notification.
          </p>
        </div>

        <button
          type="button"
          className="notification-back-button"
          onClick={() =>
            navigate("/notifications")
          }
        >
          Back
        </button>
      </div>

      <div className="notification-view-card">
        <div className="notification-view-grid">
          <div className="notification-view-item">
            <span className="notification-view-label">
              Title
            </span>

            <strong>
              {notification.title || "-"}
            </strong>
          </div>

          <div className="notification-view-item">
            <span className="notification-view-label">
              User
            </span>

            <strong>
              {notification.user?.name || "-"}
            </strong>

            {notification.user?.email && (
              <small>
                {notification.user.email}
              </small>
            )}
          </div>

          <div className="notification-view-item">
            <span className="notification-view-label">
              Type
            </span>

            <span
              className={`notification-type notification-type-${notification.type}`}
            >
              {formatType(notification.type)}
            </span>
          </div>

          <div className="notification-view-item">
            <span className="notification-view-label">
              Status
            </span>

            <span
              className={
                notification.isRead
                  ? "notification-read"
                  : "notification-unread"
              }
            >
              {notification.isRead
                ? "Read"
                : "Unread"}
            </span>
          </div>

          <div className="notification-view-item">
            <span className="notification-view-label">
              Created By
            </span>

            <strong>
              {notification.createdBy?.name ||
                "-"}
            </strong>

            {notification.createdBy?.email && (
              <small>
                {notification.createdBy.email}
              </small>
            )}
          </div>

          <div className="notification-view-item">
            <span className="notification-view-label">
              Created Date
            </span>

            <strong>
              {formatDate(notification.createdAt)}
            </strong>

            <small>
              {formatDateTime(
                notification.createdAt
              )}
            </small>
          </div>

          <div className="notification-view-item notification-view-full">
            <span className="notification-view-label">
              Message
            </span>

            <div className="notification-view-text">
              {notification.message ||
                "No message added."}
            </div>
          </div>

          <div className="notification-view-item notification-view-full">
            <span className="notification-view-label">
              Link
            </span>

            <div className="notification-view-text">
              {notification.link ||
                "No link added."}
            </div>
          </div>
        </div>

        <div className="notification-view-actions">
          <button
            type="button"
            className="notification-edit-button"
            onClick={() =>
              navigate(
                `/notifications/${notification._id}`
              )
            }
          >
            <Edit size={18} />
            Edit Notification
          </button>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
}

export default NotificationView;