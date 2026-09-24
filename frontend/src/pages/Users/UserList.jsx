import { useEffect, useState } from "react";
import { UserPlus, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";
import "./UserList.css";

function UserList() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);

      const response = await api.get("/users");

      setUsers(response.data?.users || []);
    } catch (error) {
      console.error("Failed to load users:", error);

      toast.error(
        error.response?.data?.message || "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="user-list-page">
      <div className="user-list-header">
        <div>
          <h1>Users</h1>
          <p>Manage users and their roles</p>
        </div>

        <button
          type="button"
          className="user-add-button"
          onClick={() => navigate("/users/add")}
        >
          <UserPlus size={18} />
          <span>Add User</span>
        </button>
      </div>

      <div className="user-list-card">
        {loading ? (
          <div className="user-list-loading">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="user-list-empty">No users found.</div>
        ) : (
          <div className="user-table-wrapper">
            <table className="user-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`user-role user-role-${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`user-status ${
                          user.isActive
                            ? "user-status-active"
                            : "user-status-inactive"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="user-edit-button"
                        onClick={() => navigate(`/users/${user._id}`)}
                      >
                        <Pencil size={16} />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserList;