import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createOrder } from "../../services/orderService";
import { getClients } from "../../services/clientService";

import "./Orders.css";

function AddOrder() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
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
    const loadClients = async () => {
      try {
        const data = await getClients();
        setClients(data.clients || data.data || []);
      } catch (error) {
        console.error("Get clients error:", error);

        toast.error(error.response?.data?.message || "Failed to load clients");
      } finally {
        setLoadingClients(false);
      }
    };

    loadClients();
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
      await createOrder({
        ...formData,
        amount: Number(formData.amount),
        assignedTo: formData.assignedTo || undefined,
      });

      toast.success("Order created successfully");

      setFormData({
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
    } catch (error) {
      console.error("Create order error:", error);

      toast.error(error.response?.data?.message || "Failed to create order");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div>
          <h1>Add Order</h1>
          <p>Create a new order</p>
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
              <input id="packageType" name="packageType" type="text" value={formData.packageType} onChange={handleChange} placeholder="e.g. Social Media" />
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
            {saving ? "Saving..." : "Save Order"}
          </button>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
    </div>
  );
}

export default AddOrder;