import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createScript } from "../../services/scriptService";
import { getClients } from "../../services/clientService";
import { getOrders } from "../../services/orderService";

import "./Scripts.css";

function AddScript() {
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    client: "",
    order: "",
    title: "",
    content: "",
    status: "draft",
    assignedTo: "",
    revisionNote: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [clientData, orderData] = await Promise.all([
          getClients(),
          getOrders(),
        ]);

        setClients(clientData.clients || clientData.data || []);
        setOrders(orderData.orders || orderData.data || []);
      } catch (error) {
        console.error("Load script form data error:", error);

        toast.error(error.response?.data?.message || "Failed to load clients and orders");
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
  };

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
      toast.error("Script title is required");
      return;
    }

    if (!formData.content.trim()) {
      toast.error("Script content is required");
      return;
    }

    try {
      setSaving(true);

      await createScript({
        client: formData.client,
        order: formData.order,
        title: formData.title.trim(),
        content: formData.content.trim(),
        status: formData.status,
        assignedTo: formData.assignedTo || undefined,
        revisionNote: formData.revisionNote.trim() || undefined,
      });

      toast.success("Script created successfully");

      setFormData({
        client: "",
        order: "",
        title: "",
        content: "",
        status: "draft",
        assignedTo: "",
        revisionNote: "",
      });
    } catch (error) {
      console.error("Create script error:", error);

      toast.error(error.response?.data?.message || "Failed to create script");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="scripts-page">
      <div className="scripts-header">
        <div>
          <h1>Add Script</h1>
          <p>Create a new script</p>
        </div>

        <button type="button" className="back-script-button" onClick={() => navigate("/scripts")}>
          Back
        </button>
      </div>

      <div className="script-form-card">
        <form onSubmit={handleSubmit}>
          <div className="script-form-grid">
        
            <div className="script-form-group">
              <label htmlFor="client">Client</label>

              <select id="client" name="client" value={formData.client} onChange={handleChange} disabled={loadingData}>
                <option value="">
                  {loadingData ? "Loading clients..." : "Select client"}
                </option>

                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.companyName}
                  </option>
                ))}
              </select>
            </div>

        
            <div className="script-form-group">
              <label htmlFor="order">Order</label>
              <select id="order" name="order" value={formData.order} onChange={handleChange} disabled={loadingData}>
                <option value="">
                  {loadingData ? "Loading orders..." : "Select order"}
                </option>

                {orders.map((order) => (
                  <option key={order._id} value={order._id}>
                    {order.packageName} - {order.client?.companyName || "Unknown Client"}
                  </option>
                ))}
              </select>
            </div>

            <div className="script-form-group">
              <label htmlFor="title">Script Title</label>
              <input id="title" name="title" type="text" value={formData.title} onChange={handleChange} placeholder="Enter script title" />
            </div>

            <div className="script-form-group">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={formData.status} onChange={handleChange}>
                <option value="draft">Draft</option>
                <option value="internal_review">Internal Review</option>
                <option value="client_review">Client Review</option>
                <option value="revision">Revision</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="script-form-group">
              <label htmlFor="assignedTo">Assigned To</label>
              <input id="assignedTo" name="assignedTo" type="text" value={formData.assignedTo} onChange={handleChange} placeholder="Enter user ID (optional)" />
            </div>

            <div className="script-form-group">
              <label htmlFor="revisionNote">Revision Note</label>
              <input id="revisionNote" name="revisionNote" type="text" value={formData.revisionNote} onChange={handleChange} placeholder="Enter revision note (optional)" />
            </div>

            <div className="script-form-group script-form-full">
              <label htmlFor="content">Script Content</label>
              <textarea id="content" name="content" value={formData.content} onChange={handleChange} placeholder="Write your script content here..." rows="12" />
            </div>
          </div>

          <button type="submit" className="add-script-button" disabled={saving}>
            {saving ? "Saving..." : "Save Script"}
          </button>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
    </div>
  );
}

export default AddScript;