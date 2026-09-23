import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { createVideo } from "../../services/videoService";
import { getClients } from "../../services/clientService";
import { getOrders } from "../../services/orderService";
import { getScripts } from "../../services/scriptService";
import { getUsers } from "../../services/userService";

import "./Videos.css";

function AddVideo() {
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [orders, setOrders] = useState([]);
  const [scripts, setScripts] = useState([]);
  const [users, setUsers] = useState([]);

  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    client: "",
    order: "",
    script: "",
    title: "",
    videoUrl: "",
    thumbnailUrl: "",
    status: "script_approved",
    assignedEditor: "",
    duration: "",
    notes: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [clientsData, ordersData, scriptsData, usersData] =
          await Promise.all([
            getClients(),
            getOrders(),
            getScripts(),
            getUsers(),
          ]);

        setClients(clientsData.clients || []);
        setOrders(ordersData.orders || []);
        setScripts(scriptsData.scripts || []);
        setUsers(usersData.users || []);
      } catch (error) {
        console.error("Load video form data error:", error);

        toast.error(
          error.response?.data?.message ||
            "Failed to load video form data"
        );
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "client") {
      setFormData((prev) => ({
        ...prev,
        client: value,
        order: "",
        script: "",
      }));
    }

    if (name === "order") {
      setFormData((prev) => ({
        ...prev,
        order: value,
        script: "",
      }));
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (!formData.client) return false;

    const orderClientId =
      typeof order.client === "object"
        ? order.client?._id
        : order.client;

    return orderClientId === formData.client;
  });

  const filteredScripts = scripts.filter((script) => {
    if (!formData.client || !formData.order) return false;

    const scriptClientId =
      typeof script.client === "object"
        ? script.client?._id
        : script.client;

    const scriptOrderId =
      typeof script.order === "object"
        ? script.order?._id
        : script.order;

    return (
      scriptClientId === formData.client &&
      scriptOrderId === formData.order
    );
  });

  const editorUsers = users.filter(
    (user) =>
      user.role === "employee" &&
      user.isActive !== false
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.client) {
      toast.error("Please select a client");
      return;
    }

    if (!formData.order) {
      toast.error("Please select an order");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Please enter video title");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        client: formData.client,
        order: formData.order,
        title: formData.title.trim(),
        status: formData.status,
      };

      if (formData.script) {
        payload.script = formData.script;
      }

      if (formData.videoUrl.trim()) {
        payload.videoUrl = formData.videoUrl.trim();
      }

      if (formData.thumbnailUrl.trim()) {
        payload.thumbnailUrl = formData.thumbnailUrl.trim();
      }

      if (formData.assignedEditor) {
        payload.assignedEditor = formData.assignedEditor;
      }

      if (formData.duration !== "") {
        payload.duration = Number(formData.duration);
      }

      if (formData.notes.trim()) {
        payload.notes = formData.notes.trim();
      }

      await createVideo(payload);

      toast.success("Video created successfully");

      setTimeout(() => {
        navigate("/videos");
      }, 800);
    } catch (error) {
      console.error("Create video error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to create video"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loadingData) {
    return (
      <div className="videos-page">
        <div className="videos-empty">
          <p>Loading video form...</p>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
        />
      </div>
    );
  }

  return (
    <div className="videos-page">
      <div className="videos-header">
        <div>
          <h1>Add Video</h1>
          <p>Create and manage a new video.</p>
        </div>

        <button
          type="button"
          className="video-back-button"
          onClick={() => navigate("/videos")}
        >
          <ArrowLeft size={18} />
          Back to Videos
        </button>
      </div>

      <div className="video-form-card">
        <form onSubmit={handleSubmit}>
          <div className="video-form-grid">
            <div className="video-form-group">
              <label>
                Client <span>*</span>
              </label>

              <select
                name="client"
                value={formData.client}
                onChange={handleChange}
                required
              >
                <option value="">Select Client</option>

                {clients.map((client) => (
                  <option
                    key={client._id}
                    value={client._id}
                  >
                    {client.companyName ||
                      client.contactPerson ||
                      client.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="video-form-group">
              <label>
                Order <span>*</span>
              </label>

              <select
                name="order"
                value={formData.order}
                onChange={handleChange}
                disabled={!formData.client}
                required
              >
                <option value="">
                  {formData.client
                    ? "Select Order"
                    : "Select Client First"}
                </option>

                {filteredOrders.map((order) => (
                  <option
                    key={order._id}
                    value={order._id}
                  >
                    {order.packageName ||
                      order.packageType ||
                      order._id}
                  </option>
                ))}
              </select>
            </div>

            <div className="video-form-group">
              <label>Script</label>

              <select
                name="script"
                value={formData.script}
                onChange={handleChange}
                disabled={
                  !formData.client || !formData.order
                }
              >
                <option value="">
                  {!formData.client
                    ? "Select Client First"
                    : !formData.order
                    ? "Select Order First"
                    : "Select Script (Optional)"}
                </option>

                {filteredScripts.map((script) => (
                  <option
                    key={script._id}
                    value={script._id}
                  >
                    {script.title || script._id}
                  </option>
                ))}
              </select>
            </div>

            <div className="video-form-group">
              <label>
                Video Title <span>*</span>
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter video title"
                required
              />
            </div>

            <div className="video-form-group">
              <label>Video URL</label>

              <input
                type="url"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            <div className="video-form-group">
              <label>Thumbnail URL</label>

              <input
                type="url"
                name="thumbnailUrl"
                value={formData.thumbnailUrl}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            <div className="video-form-group">
              <label>Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="script_approved">
                  Script Approved
                </option>

                <option value="shoot_pending">
                  Shoot Pending
                </option>

                <option value="raw_footage_received">
                  Raw Footage Received
                </option>

                <option value="video_editing">
                  Video Editing
                </option>

                <option value="internal_qa">
                  Internal QA
                </option>

                <option value="client_review">
                  Client Review
                </option>

                <option value="revision">
                  Revision
                </option>

                <option value="final_approved">
                  Final Approved
                </option>

                <option value="delivered">
                  Delivered
                </option>
              </select>
            </div>

            <div className="video-form-group">
              <label>Assigned Editor</label>

              <select
                name="assignedEditor"
                value={formData.assignedEditor}
                onChange={handleChange}
              >
                <option value="">
                  Select Editor
                </option>

                {editorUsers.map((user) => (
                  <option
                    key={user._id}
                    value={user._id}
                  >
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="video-form-group">
              <label>Duration (seconds)</label>

              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="0"
                placeholder="e.g. 90"
              />
            </div>

            <div className="video-form-group video-form-full">
              <label>Notes</label>

              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="5"
                placeholder="Enter video notes..."
              />
            </div>
          </div>

          <div className="video-form-actions">
            <button
              type="button"
              className="video-cancel-button"
              onClick={() => navigate("/videos")}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="video-save-button"
              disabled={saving}
            >
              <Save size={18} />

              {saving ? "Creating..." : "Create Video"}
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

export default AddVideo;