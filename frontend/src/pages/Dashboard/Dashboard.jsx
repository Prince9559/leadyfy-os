import { useEffect, useState } from "react";
import { Users, ShoppingCart, Video, CreditCard } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import StatCard from "../../components/StatCard/StatCard";
import api from "../../services/api";
import "./Dashboard.css";

function Dashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    clients: 0,
    orders: 0,
    activeVideos: 0,
    pendingPayments: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        const [clientsResponse, ordersResponse, videosResponse, paymentsResponse] = await Promise.all([
          api.get("/clients"),
          api.get("/orders"),
          api.get("/videos"),
          api.get("/payments"),
        ]);

        const clients = clientsResponse.data?.clients || [];
        const orders = ordersResponse.data?.orders || [];
        const videos = videosResponse.data?.videos || [];
        const payments = paymentsResponse.data?.payments || [];

        const activeVideos = videos.filter((video) => video.status !== "delivered");

        const pendingPayments = payments.filter((payment) => payment.status === "pending").reduce((total, payment) => total + Number(payment.amount || 0), 0);

        setStats({
          clients: clients.length,
          orders: orders.length,
          activeVideos: activeVideos.length,
          pendingPayments,
        });
      } catch (error) {
        console.error("Failed to load dashboard statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardStats();
  }, []);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, {user?.name || "User"}</p>
        </div>
      </div>

      <div className="dashboard-stats">
        <StatCard title="Total Clients" value={loading ? "..." : stats.clients} icon={Users} description="All registered clients" />
        <StatCard title="Total Orders" value={loading ? "..." : stats.orders} icon={ShoppingCart} description="All orders" />
        <StatCard title="Active Videos" value={loading ? "..." : stats.activeVideos} icon={Video} description="Videos in production" />
        <StatCard title="Pending Payments" value={loading ? "..." : `₹${stats.pendingPayments.toLocaleString("en-IN")}`} icon={CreditCard} description="Payments awaiting collection" />
      </div>

      <div className="dashboard-welcome">
        <h2>Welcome to StudioFlow</h2>
        <p>Manage your clients, orders, creators, shoots, videos and payments from one place.</p>
      </div>
    </div>
  );
}

export default Dashboard;