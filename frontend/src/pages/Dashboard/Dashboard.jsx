import {
  Users,
  ShoppingCart,
  Video,
  CreditCard,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import StatCard from "../../components/StatCard/StatCard";

import "./Dashboard.css";

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>
            Welcome back, {user?.name || "User"}
          </p>
        </div>
      </div>

      <div className="dashboard-stats">
        <StatCard
          title="Total Clients"
          value="0"
          icon={Users}
          description="All registered clients"
        />

        <StatCard
          title="Total Orders"
          value="0"
          icon={ShoppingCart}
          description="All orders"
        />

        <StatCard
          title="Active Videos"
          value="0"
          icon={Video}
          description="Videos in production"
        />

        <StatCard
          title="Pending Payments"
          value="₹0"
          icon={CreditCard}
          description="Payments awaiting collection"
        />
      </div>

      <div className="dashboard-welcome">
        <h2>Welcome to Leadyfy OS</h2>

        <p>
          Manage your clients, orders, creators, shoots,
          videos and payments from one place.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;