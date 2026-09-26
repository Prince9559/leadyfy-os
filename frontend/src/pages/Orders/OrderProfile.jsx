import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getOrderById, updateOrder } from "../../services/orderService";
import { getClients } from "../../services/clientService";

import "./Orders.css";
function OrderProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingClients, setLoadingClients] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    client: "",
    packageName: "",
    packageType: "",
    description: "",
    amount: "",
    status: "pending",
    startDate: "",
    endDate: "",
    assignedTo: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [orderData, clientData] = await Promise.all([
          getOrderById(id),
          getClients(),
        ]);

        const order = orderData.order || orderData.data;
        setClients(clientData.clients || clientData.data || []);
        setFormData({
          client: order?.client?._id || order?.client || "",
          packageName: order?.packageName || "",
          packageType: order?.packageType || "",
          description: order?.description || "",
          amount: order?.amount !== undefined ? order.amount : "",
          status: order?.status || "pending",
          startDate: order?.startDate ? new Date(order.startDate).toISOString().split("T")[0] : "",
          endDate: order?.endDate ? new Date(order.endDate).toISOString().split("T")[0] : "",
          assignedTo: order?.assignedTo?._id || order?.assignedTo || "",
        });
      } catch (error) {
        console.error("Load order error:", error);
        toast.error(error.response?.data?.message || "Failed to load order");
      } finally {
        setLoading(false);
        setLoadingClients(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.client) {
      toast.error("Please select a client");
      return;
    }

    if (!formData.packageName.trim()) {
      toast.error("Package name is required");
      return;
    }

    if (formData.amount === "" || Number(formData.amount) < 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (formData.startDate && formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      toast.error("End date cannot be before start date");
      return;
    }

    try {
      setSaving(true);

      await updateOrder(id, {
        client: formData.client,
        packageName: formData.packageName,
        packageType: formData.packageType,
        description: formData.description,
        amount: Number(formData.amount),
        status: formData.status,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        assignedTo: formData.assignedTo || undefined,
      });

      toast.success("Order updated successfully");

      setTimeout(() => {
        navigate("/orders");
      }, 700);
    } catch (error) {
      console.error("Update order error:", error);

      toast.error(error.response?.data?.message || "Failed to update order");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-empty">
          <p>Loading order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div>
          <h1>Edit Order</h1>
          <p>Update order information</p>
        </div>

        <button type="button" className="back-order-button" onClick={() => navigate("/orders")}>
          Back
        </button>
      </div>

      <div className="order-form-card">
        <form onSubmit={handleSubmit}>
          <div className="order-form-grid">
            <div className="order-form-group">
              <label htmlFor="client">Client</label>

              <select id="client" name="client" value={formData.client} onChange={handleChange} disabled={loadingClients}>
                <option value="">
                  {loadingClients ? "Loading clients..." : "Select client"}
                </option>

                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.companyName}
                  </option>
                ))}
              </select>
            </div>

            <div className="order-form-group">
              <label htmlFor="packageName">Package Name</label>

              <input id="packageName" name="packageName" type="text" value={formData.packageName} onChange={handleChange} placeholder="Enter package name" />
            </div>

            <div className="order-form-group">
              <label htmlFor="packageType">Package Type</label>

              <input id="packageType" name="packageType" type="text" value={formData.packageType} onChange={handleChange} placeholder="Enter package type" />
            </div>

            <div className="order-form-group">
              <label htmlFor="amount">Amount</label>

              <input id="amount" name="amount" type="number" min="0" value={formData.amount} onChange={handleChange} placeholder="Enter amount" />
            </div>

            <div className="order-form-group">
              <label htmlFor="status">Status</label>

              <select id="status" name="status" value={formData.status} onChange={handleChange}>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="order-form-group">
              <label htmlFor="startDate">Start Date</label>

              <input id="startDate" name="startDate" type="date" value={formData.startDate} onChange={handleChange} />
            </div>

            <div className="order-form-group">
              <label htmlFor="endDate">End Date</label>

              <input id="endDate" name="endDate" type="date" value={formData.endDate} onChange={handleChange} />
            </div>

            <div className="order-form-group">
              <label htmlFor="assignedTo">Assigned To</label>

              <input id="assignedTo" name="assignedTo" type="text" value={formData.assignedTo} onChange={handleChange} placeholder="Enter user ID" />
            </div>

            <div className="order-form-group order-form-full">
              <label htmlFor="description">Description</label>

              <textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Enter order description" rows="5" />
            </div>
          </div>

          <button type="submit" className="add-order-button" disabled={saving}>
            {saving ? "Updating..." : "Update Order"}
          </button>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
    </div>
  );
}

export default OrderProfile;