import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createNotification } from "../../services/notificationService";
import api from "../../services/api";
import "./Notifications.css";

function AddNotification() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    user: "",
    title: "",
    message: "",
    type: "system",
    link: "",
  });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoadingData(true);
        const response = await api.get("/users");
        setUsers(response.data.users || []);
      } catch (error) {
        console.error("Load notification users error:", error);
        toast.error(error.response?.data?.message || "Failed to load users");
      } finally {
        setLoadingData(false);
      }
    };

    loadUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
      toast.error("Please enter notification message");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        user: formData.user,
        title: formData.title.trim(),
        message: formData.message.trim(),
        type: formData.type,
      };

      if (formData.link.trim()) {
        payload.link = formData.link.trim();
      }

      await createNotification(payload);
      toast.success("Notification created successfully");

      setTimeout(() => {
        navigate("/notifications");
      }, 800);
    } catch (error) {
      console.error("Create notification error:", error);
      toast.error(error.response?.data?.message || "Failed to create notification");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div>
          <h1>Add Notification</h1>
          <p>Create and send a notification to a user.</p>
        </div>
        <button type="button" className="notification-back-button" onClick={() => navigate("/notifications")} disabled={saving}>
          Back
        </button>
      </div>

      <div className="notification-form-card">
        {loadingData ? (
          <div className="notifications-empty">
            <p>Loading users...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="notification-form-grid">
              <div className="notification-form-group">
                <label>User <span>*</span></label>
                <select name="user" value={formData.user} onChange={handleChange} required>
                  <option value="">Select user</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name}{user.role ? ` (${user.role})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="notification-form-group">
                <label>Type</label>
                <select name="type" value={formData.type} onChange={handleChange}>
                  <option value="task">Task</option>
                  <option value="order">Order</option>
                  <option value="script">Script</option>
                  <option value="shoot">Shoot</option>
                  <option value="video">Video</option>
                  <option value="payment">Payment</option>
                  <option value="support">Support</option>
                  <option value="system">System</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="notification-form-group notification-form-full">
                <label>Title <span>*</span></label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Enter notification title" required />
              </div>

              <div className="notification-form-group notification-form-full">
                <label>Message <span>*</span></label>
                <textarea name="message" value={formData.message} onChange={handleChange} rows="5" placeholder="Enter notification message..." required />
              </div>

              <div className="notification-form-group notification-form-full">
                <label>Link</label>
                <input type="text" name="link" value={formData.link} onChange={handleChange} placeholder="Example: /tasks/view/123" />
              </div>
            </div>

            <div className="notification-form-actions">
              <button type="submit" className="notification-save-button" disabled={saving}>
                <Save size={18} />
                {saving ? "Creating..." : "Create Notification"}
              </button>
            </div>
          </form>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
    </div>
  );
}

export default AddNotification;