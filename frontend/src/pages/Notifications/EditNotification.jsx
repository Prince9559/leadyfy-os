import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save } from "lucide-react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  getNotificationById,
  updateNotification,
} from "../../services/notificationService";

import api from "../../services/api";

import "./Notifications.css";

function EditNotification() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    user: "",
    title: "",
    message: "",
    type: "system",
    isRead: false,
    link: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [
          notificationResponse,
          usersResponse,
        ] = await Promise.all([
          getNotificationById(id),
          api.get("/users"),
        ]);

        const notification =
          notificationResponse.notification;

        if (!notification) {
          toast.error("Notification not found");
          return;
        }

        setUsers(usersResponse.data.users || []);

        setFormData({
          user: notification.user?._id || "",
          title: notification.title || "",
          message: notification.message || "",
          type: notification.type || "system",
          isRead: notification.isRead || false,
          link: notification.link || "",
        });
      } catch (error) {
        console.error(
          "Load edit notification error:",
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

    loadData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReadChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      isRead: e.target.checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.user) {
      toast.error("Please select a user");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Please enter notification title");
      return;
    }

    if (!formData.message.trim()) {
      toast.error(
        "Please enter notification message"
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        user: formData.user,
        title: formData.title.trim(),
        message: formData.message.trim(),
        type: formData.type,
        isRead: formData.isRead,
        link: formData.link.trim(),
      };

      await updateNotification(id, payload);

      toast.success(
        "Notification updated successfully"
      );

      setTimeout(() => {
        navigate(`/notifications/view/${id}`);
      }, 800);
    } catch (error) {
      console.error(
        "Update notification error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update notification"
      );
    } finally {
      setSaving(false);
    }
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

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div>
          <h1>Edit Notification</h1>

          <p>
            Update notification details and status.
          </p>
        </div>

        <button
          type="button"
          className="notification-back-button"
          onClick={() =>
            navigate(`/notifications/view/${id}`)
          }
          disabled={saving}
        >
          Back
        </button>
      </div>

      <div className="notification-form-card">
        <form onSubmit={handleSubmit}>
          <div className="notification-form-grid">
            <div className="notification-form-group">
              <label>
                User <span>*</span>
              </label>

              <select
                name="user"
                value={formData.user}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select user
                </option>

                {users.map((user) => (
                  <option
                    key={user._id}
                    value={user._id}
                  >
                    {user.name}
                    {user.role
                      ? ` (${user.role})`
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="notification-form-group">
              <label>Type</label>

              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="task">
                  Task
                </option>

                <option value="order">
                  Order
                </option>

                <option value="script">
                  Script
                </option>

                <option value="shoot">
                  Shoot
                </option>

                <option value="video">
                  Video
                </option>

                <option value="payment">
                  Payment
                </option>

                <option value="support">
                  Support
                </option>

                <option value="system">
                  System
                </option>

                <option value="other">
                  Other
                </option>
              </select>
            </div>

            <div className="notification-form-group notification-form-full">
              <label>
                Title <span>*</span>
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter notification title"
                required
              />
            </div>

            <div className="notification-form-group notification-form-full">
              <label>
                Message <span>*</span>
              </label>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                placeholder="Enter notification message..."
                required
              />
            </div>

            <div className="notification-form-group">
              <label>Read Status</label>

              <label className="notification-checkbox">
                <input
                  type="checkbox"
                  checked={formData.isRead}
                  onChange={handleReadChange}
                />

                <span>
                  Mark as read
                </span>
              </label>
            </div>

            <div className="notification-form-group">
              <label>Link</label>

              <input
                type="text"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="/tasks/view/123"
              />
            </div>
          </div>

          <div className="notification-form-actions">
            <button
              type="submit"
              className="notification-save-button"
              disabled={saving}
            >
              <Save size={18} />

              {saving
                ? "Updating..."
                : "Update Notification"}
            </button>
          </div>
        </form>
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

export default EditNotification;