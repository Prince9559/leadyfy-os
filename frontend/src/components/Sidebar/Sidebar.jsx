import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { LayoutDashboard, Users, ShoppingCart, FileText, UserRound, CalendarDays, Video, CreditCard, Receipt, CheckSquare, Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Clients", path: "/clients", icon: Users },
    { label: "Orders", path: "/orders", icon: ShoppingCart },
    { label: "Scripts", path: "/scripts", icon: FileText },
    { label: "Creators", path: "/creators", icon: UserRound },
    { label: "Shoots", path: "/shoots", icon: CalendarDays },
    { label: "Videos", path: "/videos", icon: Video },
    { label: "Payments", path: "/payments", icon: CreditCard },
    { label: "Expenses", path: "/expenses", icon: Receipt },
    { label: "Tasks", path: "/tasks", icon: CheckSquare },
    ...(user?.role === "owner" || user?.role === "admin"
      ? [{ label: "Users", path: "/users", icon: Users }]
      : []),
  ];

  return (
    <>
      <button type="button" className="mobile-menu-button" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu size={24} /></button>

      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}

      <aside className={`sidebar ${mobileOpen ? "sidebar-mobile-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-content">
            <h2>StudioFlow</h2>
          </div>

          <button type="button" className="sidebar-close-button" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={22} /></button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.path} to={item.path} onClick={() => setMobileOpen(false)} className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                <Icon size={19} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;