import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Eye, Edit, Trash2, Bell } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getNotifications, deleteNotification } from "../../services/notificationService";

import "./Notifications.css";
function NotificationList() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Get notifications error:", error);
      toast.error(error.response?.data?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

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
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleDelete = (notification) => {
    toast(
      ({ closeToast }) => (
        <div className="notification-delete-confirm">
          <p>
            Delete <strong>Are you sure you want to delete this notification?</strong>?
          </p>
          <div className="notification-confirm-actions">
            <button type="button" className="notification-confirm-delete" onClick={async () => {
              try {
                await deleteNotification(notification._id);
                setNotifications((prev) => prev.filter((item) => item._id !== notification._id));

                toast.success("Notification deleted successfully");
              } catch (error) {
                console.error("Delete notification error:", error);

                toast.error(error.response?.data?.message || "Failed to delete notification");
              }

              closeToast();
            }}>
              Delete
            </button>

            <button type="button" className="notification-confirm-cancel" onClick={closeToast}>
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeButton: false,
        position: "top-right",
      }
    );
  };

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div>
          <h1>Notifications</h1>
          <p>Manage and track notifications for your team.</p>
        </div>

        <button type="button" className="add-notification-button" onClick={() => navigate("/notifications/add")}>
          <Plus size={18} />
          Add Notification
        </button>
      </div>

      {loading ? (
        <div className="notifications-empty">
          <p>Loading notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="notifications-empty">
          <Bell size={36} />

          <p>No notifications found.</p>

          <button type="button" onClick={() => navigate("/notifications/add")}>
            Create your first notification
          </button>
        </div>
      ) : (
        <>
          <div className="notifications-table-card">
            <div className="notifications-table-wrapper">
              <table className="notifications-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>User</th>
                    <th>Type</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {notifications.map((notification) => (
                    <tr key={notification._id}>
                      <td className="notification-title-cell">{notification.title}</td>

                      <td>{notification.user?.name || "-"}</td>

                      <td>
                        <span className={`notification-type notification-type-${notification.type}`}>
                          {formatType(notification.type)}
                        </span>
                      </td>

                      <td className="notification-message-cell">{notification.message}</td>

                      <td>
                        <span className={notification.isRead ? "notification-read" : "notification-unread"}>
                          {notification.isRead ? "Read" : "Unread"}
                        </span>
                      </td>

                      <td>{formatDate(notification.createdAt)}</td>

                      <td>
                        <div className="notification-actions">
                          <button type="button" title="View" className="notification-action-view" onClick={() => navigate(`/notifications/view/${notification._id}`)}>
                            <Eye size={17} />
                          </button>

                          <button type="button" title="Edit" className="notification-action-edit" onClick={() => navigate(`/notifications/${notification._id}`)}>
                            <Edit size={17} />
                          </button>

                          <button type="button" title="Delete" className="notification-action-delete" onClick={() => handleDelete(notification)}>
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="notifications-mobile-list">
            {notifications.map((notification) => (
              <div className="notification-mobile-card" key={notification._id}>
                <div className="notification-mobile-top">
                  <div>
                    <h3>{notification.title}</h3>
                    <p>{notification.user?.name || "Unknown User"}</p>
                  </div>

                  <span className={`notification-type notification-type-${notification.type}`}>
                    {formatType(notification.type)}
                  </span>
                </div>

                <div className="notification-mobile-message">{notification.message}</div>

                <div className="notification-mobile-details">
                  <div>
                    <span>Status</span>
                    <strong className={notification.isRead ? "notification-read" : "notification-unread"}>
                      {notification.isRead ? "Read" : "Unread"}
                    </strong>
                  </div>

                  <div>
                    <span>Date</span>

                    <strong>{formatDate(notification.createdAt)}</strong>
                  </div>
                </div>

                <div className="notification-mobile-actions">
                  <button type="button" onClick={() => navigate(`/notifications/view/${notification._id}`)}>
                    <Eye size={16} />
                    View
                  </button>

                  <button type="button" onClick={() => navigate(`/notifications/${notification._id}`)}>
                    <Edit size={16} />
                    Edit
                  </button>

                  <button type="button" onClick={() => handleDelete(notification)}>
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
    </div>
  );
}

export default NotificationList;