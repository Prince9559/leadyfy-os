import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Pencil, Eye, Plus } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getPayments, deletePayment } from "../../services/paymentService";
import "./Payments.css";

function PaymentList() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const data = await getPayments();
        setPayments(data.payments || []);
      } catch (error) {
        console.error("Get payments error:", error);
        toast.error(error.response?.data?.message || "Failed to load payments");
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

  const formatStatus = (status) => {
    if (!status) return "-";
    return status .replace(/_/g, " ") .replace(/\b\w/g, (char) => char.toUpperCase());};

  const formatPaymentMethod = (method) => {
    if (!method) return "-";
    return method .replace(/_/g, " ") .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatDate = (date) => {
    if (!date) return "-";
    const formattedDate = new Date(date);
    if (Number.isNaN(formattedDate.getTime())) {
      return "-";
    }

    return formattedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatAmount = (amount) => {
    if (amount === undefined || amount === null || amount === "") {
      return "₹0";
    }

    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  const handleDelete = (payment) => {
    if (!payment?._id) return;
    toast(
      ({ closeToast }) => (
        <div>
          <p style={{ margin: "0 0 12px", fontWeight: "600" }}>
            Are you sure you want to delete this payment?
          </p>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={async () => {
                try {
                  await deletePayment(payment._id);
                  setPayments((prev) => prev.filter((item) => item._id !== payment._id));
                  closeToast();
                  toast.success("Payment deleted successfully");
                } catch (error) {
                  console.error("Delete payment error:", error);

                  closeToast();
                  toast.error(error.response?.data?.message || "Failed to delete payment");
                }
              }}
              style={{ border: "none", borderRadius: "6px", padding: "7px 12px", background: "#dc2626", color: "#ffffff", cursor: "pointer", fontWeight: "600" }}>
              Confirm Delete
            </button>

            <button type="button" onClick={closeToast} style={{ border: "1px solid #d1d5db", borderRadius: "6px", padding: "7px 12px", background: "#ffffff", color: "#374151", cursor: "pointer", fontWeight: "600" }}>
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
      }
    );
  };

  return (
    <div className="payments-page">
      <div className="payments-header">
        <div>
          <h1>Payments</h1>

          <p>
            Manage and track all client payments • {payments.length}{" "}
            {payments.length === 1 ? "payment" : "payments"}
          </p>
        </div>

        <button type="button" className="add-payment-button" onClick={() => navigate("/payments/add")}>
          <Plus size={18} />
          Add Payment
        </button>
      </div>

      {loading ? (
        <div className="payments-empty">
          <p>Loading payments...</p>
        </div>
      ) : payments.length === 0 ? (
        <div className="payments-empty">
          <h2>No Payments Found</h2>

          <p>Add your first payment to start managing payment records.</p>

          <button type="button" className="add-payment-button" onClick={() => navigate("/payments/add")}>
            <Plus size={18} />
            Add First Payment
          </button>
        </div>
      ) : (
        <div className="payments-table-card">
          <div className="payments-table-wrapper">
            <table className="payments-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Order</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Transaction ID</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <tr key={payment._id}>
                    <td>
                      <div className="payment-client-cell">
                        <strong>{payment.client?.companyName || "-"}</strong>

                        {payment.client?.contactPerson && (<span>{payment.client.contactPerson}</span>)}
                      </div>
                    </td>

                    <td>{payment.order?.packageName || "-"}</td>

                    <td>
                      <strong>{formatAmount(payment.amount)}</strong>
                    </td>

                    <td>{formatPaymentMethod(payment.paymentMethod)}</td>
                    <td>{payment.transactionId || "-"}</td>
                    <td>{formatDate(payment.paymentDate)}</td>

                    <td>
                      <span className={`payment-status payment-status-${payment.status}`}>
                        {formatStatus(payment.status)}
                      </span>
                    </td>

                    <td>
                      <div className="payment-actions">
                        <button type="button" title="View" onClick={() => navigate(`/payments/view/${payment._id}`)}>
                          <Eye size={17} />
                        </button>

                        <button type="button" title="Edit" onClick={() => navigate(`/payments/${payment._id}`)}>
                          <Pencil size={17} />
                        </button>

                        <button type="button" title="Delete" className="payment-delete-action" onClick={() => handleDelete(payment)}>
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="payments-mobile-list">
            {payments.map((payment) => (
              <div className="payment-mobile-card" key={payment._id}>
                <div className="payment-mobile-top">
                  <div>
                    <h3>{payment.client?.companyName || "-"}</h3>
                    <span>{payment.order?.packageName || "-"}</span>
                  </div>

                  <strong>{formatAmount(payment.amount)}</strong>
                </div>

                <div className="payment-mobile-details">
                  <div>
                    <span>Method</span>

                    <strong>{formatPaymentMethod(payment.paymentMethod)}</strong>
                  </div>

                  <div>
                    <span>Date</span>

                    <strong>{formatDate(payment.paymentDate)}</strong>
                  </div>

                  <div>
                    <span>Status</span>

                    <strong>{formatStatus(payment.status)}</strong>
                  </div>

                  <div>
                    <span>Transaction ID</span>

                    <strong>{payment.transactionId || "-"}</strong>
                  </div>
                </div>

                <div className="payment-mobile-actions">
                  <button type="button" onClick={() => navigate(`/payments/view/${payment._id}`)}>
                    <Eye size={16} />
                    View
                  </button>

                  <button type="button" onClick={() => navigate(`/payments/${payment._id}`)}>
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button type="button" className="payment-mobile-delete" onClick={() => handleDelete(payment)}>
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
    </div>
  );
}

export default PaymentList;