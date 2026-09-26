import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById } from "../../services/orderService";
import "./Orders.css";

function OrderView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const data = await getOrderById(id);
        console.log("ORDER VIEW DATA:", data);
        setOrder(data.order || data.data);
      } catch (error) {
        console.error("Get order error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  const formatAmount = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  const formatStatus = (status) => {
    return status?.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString("en-IN");
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

  if (!order) {
    return (
      <div className="orders-page">
        <div className="orders-empty">
          <h2>Order Not Found</h2>
          <button type="button" className="back-order-button" onClick={() => navigate("/orders")}>Back to Orders</button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div>
          <h1>{order.packageName}</h1>
          <p>Order details</p>
        </div>

        <button type="button" className="back-order-button" onClick={() => navigate("/orders")}>Back</button>
      </div>

      <div className="order-view-card">
        <div className="order-view-top">
          <div>
            <span className="order-view-label">Client</span>
            <h2>{order.client?.companyName || "Unknown Client"}</h2>
          </div>

          <span className={`order-status-badge status-${order.status}`}>{formatStatus(order.status)}</span>
        </div>

        <div className="order-view-grid">
          <div className="order-view-item"><span>Package Name</span><strong>{order.packageName || "-"}</strong></div>
          <div className="order-view-item"><span>Package Type</span><strong>{order.packageType || "-"}</strong></div>
          <div className="order-view-item"><span>Amount</span><strong>{formatAmount(order.amount)}</strong></div>
          <div className="order-view-item"><span>Start Date</span><strong>{formatDate(order.startDate)}</strong></div>
          <div className="order-view-item"><span>End Date</span><strong>{formatDate(order.endDate)}</strong></div>
          <div className="order-view-item"><span>Assigned To</span><strong>{order.assignedTo?.name || "-"}</strong></div>
          <div className="order-view-item"><span>Client Contact</span><strong>{order.client?.contactPerson || "-"}</strong></div>
          <div className="order-view-item"><span>Client Email</span><strong>{order.client?.email || "-"}</strong></div>
        </div>

        <div className="order-view-description">
          <span>Description</span>
          <p>{order.description || "No description added for this order."}</p>
        </div>

        <div className="order-view-actions">
          <button type="button" className="edit-order-button" onClick={() => navigate(`/orders/${order._id}`)}>Edit Order</button>
        </div>
      </div>
    </div>
  );
}

export default OrderView;