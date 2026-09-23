import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Edit } from "lucide-react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getPaymentById } from "../../services/paymentService";

import "./Payments.css";

function PaymentView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPayment = async () => {
      try {
        const data = await getPaymentById(id);
        setPayment(data.payment);
      } catch (error) {
        console.error("Get payment error:", error);

        toast.error(
          error.response?.data?.message ||
            "Failed to load payment"
        );
      } finally {
        setLoading(false);
      }
    };

    loadPayment();
  }, [id]);

  const formatAmount = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatMethod = (method) => {
    const methods = {
      cash: "Cash",
      bank_transfer: "Bank Transfer",
      upi: "UPI",
      card: "Card",
      other: "Other",
    };

    return methods[method] || method || "-";
  };

  const formatStatus = (status) => {
    const statuses = {
      pending: "Pending",
      completed: "Completed",
      failed: "Failed",
      refunded: "Refunded",
    };

    return statuses[status] || status || "-";
  };

  if (loading) {
    return (
      <div className="payments-page">
        <div className="payments-empty">
          <p>Loading payment...</p>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
        />
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="payments-page">
        <div className="payments-header">
          <div>
            <h1>Payment Details</h1>
            <p>Payment information could not be found.</p>
          </div>

          <button
            type="button"
            className="payment-back-button"
            onClick={() => navigate("/payments")}
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
    <div className="payments-page">
      {/* Header */}
      <div className="payments-header">
        <div>
          <h1>Payment Details</h1>

          <p>
            View complete information about this payment.
          </p>
        </div>

        <button
          type="button"
          className="payment-back-button"
          onClick={() => navigate("/payments")}
        >
          Back
        </button>
      </div>

      {/* Details Card */}
      <div className="payment-view-card">
        <div className="payment-view-grid">
          {/* Client */}
          <div className="payment-view-item">
            <span className="payment-view-label">
              Client
            </span>

            <strong>
              {payment.client?.companyName ||
                payment.client?.contactPerson ||
                "-"}
            </strong>

            {payment.client?.email && (
              <small>{payment.client.email}</small>
            )}
          </div>

          {/* Order */}
          <div className="payment-view-item">
            <span className="payment-view-label">
              Order
            </span>

            <strong>
              {payment.order?.packageName ||
                payment.order?.packageType ||
                "-"}
            </strong>
          </div>

          {/* Amount */}
          <div className="payment-view-item">
            <span className="payment-view-label">
              Amount
            </span>

            <strong className="payment-view-amount">
              {formatAmount(payment.amount)}
            </strong>
          </div>

          {/* Payment Method */}
          <div className="payment-view-item">
            <span className="payment-view-label">
              Payment Method
            </span>

            <strong>
              {formatMethod(payment.paymentMethod)}
            </strong>
          </div>

          {/* Transaction ID */}
          <div className="payment-view-item">
            <span className="payment-view-label">
              Transaction ID
            </span>

            <strong>
              {payment.transactionId || "-"}
            </strong>
          </div>

          {/* Payment Date */}
          <div className="payment-view-item">
            <span className="payment-view-label">
              Payment Date
            </span>

            <strong>
              {formatDate(payment.paymentDate)}
            </strong>
          </div>

          {/* Status */}
          <div className="payment-view-item">
            <span className="payment-view-label">
              Status
            </span>

            <span
              className={`payment-view-status payment-status-${payment.status}`}
            >
              {formatStatus(payment.status)}
            </span>
          </div>

          {/* Created By */}
          <div className="payment-view-item">
            <span className="payment-view-label">
              Created By
            </span>

            <strong>
              {payment.createdBy?.name || "-"}
            </strong>

            {payment.createdBy?.email && (
              <small>{payment.createdBy.email}</small>
            )}
          </div>

          {/* Notes */}
          <div className="payment-view-item payment-view-full">
            <span className="payment-view-label">
              Notes
            </span>

            <div className="payment-view-notes">
              {payment.notes || "No notes added."}
            </div>
          </div>
        </div>

        {/* Bottom Action */}
        <div className="payment-view-actions">
          <button
            type="button"
            className="payment-edit-button"
            onClick={() =>
              navigate(`/payments/${payment._id}`)
            }
          >
            <Edit size={18} />
            Edit Payment
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

export default PaymentView;