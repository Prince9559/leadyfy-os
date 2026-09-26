import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import "./AddUser.css";

function AddUser() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please enter name");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Please enter email");
      return;
    }

    if (!formData.password) {
      toast.error("Please enter password");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      await api.post("/users", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      });

      toast.success("User created successfully");

      setTimeout(() => {
        navigate("/users");
      }, 1500);
    } catch (error) {
      console.error("Failed to create user:", error);

      toast.error(error.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-user-page">
      <div className="add-user-header">
        <div>
          <h1>Add User</h1>
          <p>Create a new user account</p>
        </div>

        <button type="button" className="add-user-back-button" onClick={() => navigate("/users")}>
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
      </div>

      <form className="add-user-card" onSubmit={handleSubmit}>
        <div className="add-user-form-grid">
          <div className="add-user-field">
            <label htmlFor="name">Name</label>

            <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} placeholder="Enter name" />
          </div>

          <div className="add-user-field">
            <label htmlFor="email">Email</label>

            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter email" />
          </div>

          <div className="add-user-field">
            <label htmlFor="password">Password</label>

            <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Enter password" />
          </div>

          <div className="add-user-field">
            <label htmlFor="role">Role</label>

            <select id="role" name="role" value={formData.role} onChange={handleChange}>
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
              <option value="client">Client</option>

              {user?.role === "owner" && <option value="owner">Owner</option>}
            </select>
          </div>
        </div>

        <div className="add-user-actions">
          <button type="submit" className="add-user-submit-button" disabled={loading}>
            {loading ? "Creating..." : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddUser;