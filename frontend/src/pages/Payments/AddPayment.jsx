import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save } from "lucide-react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { createPayment } from "../../services/paymentService";
import { getClients } from "../../services/clientService";
import { getOrders } from "../../services/orderService";

import "./Payments.css";

function AddPayment() {
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    client: "",
    order: "",
    amount: "",
    paymentMethod: "bank_transfer",
    transactionId: "",
    paymentDate: new Date()
      .toISOString()
      .split("T")[0],
    status: "completed",
    notes: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [clientsData, ordersData] =
          await Promise.all([
            getClients(),
            getOrders(),
          ]);

        setClients(clientsData.clients || []);
        setOrders(ordersData.orders || []);
      } catch (error) {
        console.error(
          "Load payment form data error:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to load payment form data"
        );
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "client") {
      setFormData((prev) => ({
        ...prev,
        client: value,
        order: "",
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredOrders = orders.filter((order) => {
    if (!formData.client) return false;

    const orderClientId =
      typeof order.client === "object"
        ? order.client?._id
        : order.client;

    return orderClientId === formData.client;
  });

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

    if (
      formData.amount === "" ||
      Number(formData.amount) < 0
    ) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        client: formData.client,
        order: formData.order,
        amount: Number(formData.amount),
        paymentMethod:
          formData.paymentMethod,
        status: formData.status,
      };

      if (formData.transactionId.trim()) {
        payload.transactionId =
          formData.transactionId.trim();
      }

      if (formData.paymentDate) {
        payload.paymentDate =
          formData.paymentDate;
      }

      if (formData.notes.trim()) {
        payload.notes = formData.notes.trim();
      }

      await createPayment(payload);

      toast.success(
        "Payment created successfully"
      );

      setTimeout(() => {
        navigate("/payments");
      }, 800);
    } catch (error) {
      console.error(
        "Create payment error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to create payment"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loadingData) {
    return (
      <div className="payments-page">
        <div className="payments-empty">
          <p>Loading payment form...</p>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
        />
      </div>
    );
  }

  return (
    <div className="payments-page">
      <div className="payments-header">
        <div>
          <h1>Add Payment</h1>

          <p>
            Create and record a new client
            payment.
          </p>
        </div>

        <button
          type="button"
          className="payment-back-button"
          onClick={() => navigate("/payments")}
          disabled={saving}
        >
          Back
        </button>
      </div>

      <div className="payment-form-card">
        <form onSubmit={handleSubmit}>
          <div className="payment-form-grid">
            {/* Client */}
            <div className="payment-form-group">
              <label>
                Client <span>*</span>
              </label>

              <select
                name="client"
                value={formData.client}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select Client
                </option>

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

            {/* Order */}
            <div className="payment-form-group">
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

            {/* Amount */}
            <div className="payment-form-group">
              <label>
                Amount <span>*</span>
              </label>

              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="Enter amount"
                required
              />
            </div>

            {/* Payment Method */}
            <div className="payment-form-group">
              <label>Payment Method</label>

              <select
                name="paymentMethod"
                value={
                  formData.paymentMethod
                }
                onChange={handleChange}
              >
                <option value="bank_transfer">
                  Bank Transfer
                </option>

                <option value="upi">
                  UPI
                </option>

                <option value="cash">
                  Cash
                </option>

                <option value="card">
                  Card
                </option>

                <option value="other">
                  Other
                </option>
              </select>
            </div>

            {/* Transaction ID */}
            <div className="payment-form-group">
              <label>Transaction ID</label>

              <input
                type="text"
                name="transactionId"
                value={
                  formData.transactionId
                }
                onChange={handleChange}
                placeholder="Enter transaction ID"
              />
            </div>

            {/* Payment Date */}
            <div className="payment-form-group">
              <label>Payment Date</label>

              <input
                type="date"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleChange}
              />
            </div>

            {/* Status */}
            <div className="payment-form-group">
              <label>Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="completed">
                  Completed
                </option>

                <option value="pending">
                  Pending
                </option>

                <option value="failed">
                  Failed
                </option>

                <option value="refunded">
                  Refunded
                </option>
              </select>
            </div>

            {/* Notes */}
            <div className="payment-form-group payment-form-full">
              <label>Notes</label>

              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="5"
                placeholder="Enter payment notes..."
              />
            </div>
          </div>

          <div className="payment-form-actions">
            <button
              type="submit"
              className="payment-save-button"
              disabled={saving}
            >
              <Save size={18} />

              {saving
                ? "Creating..."
                : "Create Payment"}
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

export default AddPayment;