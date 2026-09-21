import { Bell, UserCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

import "./Navbar.css";

function Navbar() {
  const { user } = useAuth();
  console.log("NAVBAR USER:", user);

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h2 className="navbar-title">Leadyfy OS</h2>
      </div>

      <div className="navbar-right">
        <button
          type="button"
          className="navbar-icon-button"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </button>

        <div className="navbar-user">
          <UserCircle size={32} />

          <div className="navbar-user-info">
            <span className="navbar-user-name">
              {user?.name || "User"}
            </span>

            <span className="navbar-user-role">
              {user?.role || "Employee"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;