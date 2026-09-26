import { useEffect, useState } from "react";
import { Search, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {getOrders,deleteOrder,} from "../../services/orderService";

import "./Orders.css";

function OrderList() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data.orders || data.data || []);
      } catch (error) {
        console.error("Get orders error:", error);

        toast.error(error.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handleDelete = (id) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p style={{ margin: "0 0 12px", fontWeight: "600", color: "#111827" }}>
            Are you sure you want to delete this order?
          </p>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={async () => {
                closeToast();
                try {
                  await deleteOrder(id);
                  setOrders((prev) => prev.filter((order) => order._id !== id));
                  toast.success("Order deleted successfully");
                } catch (error) {
                  console.error("Delete order error:", error);
                  toast.error(error.response?.data?.message || "Failed to delete order");
                }
              }}
              style={{ border: "none", background: "#dc2626", color: "#ffffff", padding: "7px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>
              Yes, Delete
            </button>

            <button type="button" onClick={closeToast}style={{ border: "1px solid #d1d5db", background: "#ffffff", color: "#374151", padding: "7px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>
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

  const filteredOrders = orders.filter((order) => {
    const searchText = search.toLowerCase().trim();

    const companyName = order.client?.companyName?.toLowerCase() || "";
    const packageName = order.packageName?.toLowerCase() || "";
    const packageType = order.packageType?.toLowerCase() || "";
    const status = order.status?.toLowerCase() || "";

    return (
      companyName.includes(searchText) ||
      packageName.includes(searchText) ||
      packageType.includes(searchText) ||
      status.includes(searchText)
    );
  });

  const formatAmount = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  const formatStatus = (status) => {
    return status
      ?.replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div>
          <h1>Orders</h1>

          <p>
            Manage all your orders • {orders.length}{" "}
            {orders.length === 1 ? "order" : "orders"}
          </p>
        </div>

        <button type="button" className="add-order-button" onClick={() => navigate("/orders/add")}>
          Add Order
        </button>
      </div>

      <div className="order-search-box">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search orders by client, package or status..." />

        <Search size={19} className="order-search-icon" />
      </div>

      {loading ? (
        <div className="orders-empty">
          <p>Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="orders-empty">
          <ShoppingCart size={40} />

          <h2>No Orders Found</h2>

          <p>Add your first order to start managing your orders.</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="orders-empty">
          <Search size={40} />

          <h2>No Orders Found</h2>

          <p>No order matches your search. Try a different search term.</p>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => (
            <div className="order-card" key={order._id}>
              <div className="order-card-header">
                <div>
                  <h3>{order.packageName}</h3>

                  <p className="order-client-name">
                    {order.client?.companyName || "Unknown Client"}
                  </p>
                </div>

                <span className={`order-status-badge status-${order.status}`}>
                  {formatStatus(order.status)}
                </span>
              </div>

              <div className="order-card-info">
                <div>
                  <span>Package Type</span>
                  <strong>{order.packageType || "-"}</strong>
                </div>

                <div>
                  <span>Amount</span>
                  <strong>{formatAmount(order.amount)}</strong>
                </div>

                <div>
                  <span>Start Date</span>
                  <strong>
                    {order.startDate ? new Date(order.startDate).toLocaleDateString("en-IN") : "-"}
                  </strong>
                </div>

                <div>
                  <span>End Date</span>
                  <strong>
                    {order.endDate ? new Date(order.endDate).toLocaleDateString("en-IN") : "-"}
                  </strong>
                </div>
              </div>

              {order.description && (
                <p className="order-description">{order.description}</p>
              )}

              <div className="order-card-actions">
                <button type="button" className="view-order-button" onClick={() => navigate(`/orders/view/${order._id}`)}>
                  View
                </button>

                <button type="button" className="edit-order-button" onClick={() => navigate(`/orders/${order._id}`)}>
                  Edit
                </button>

                <button type="button" className="delete-order-button" onClick={() => handleDelete(order._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
    </div>
  );
}

export default OrderList;