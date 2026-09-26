import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import "./EditUser.css";

function EditUser() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "employee",
    isActive: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await api.get(`/users/${id}`);
        const user = response.data?.user;
        if (!user) {
          toast.error("User not found");
          navigate("/users");
          return;
        }

        setFormData({
          name: user.name || "",
          email: user.email || "",
          role: user.role || "employee",
          isActive: user.isActive ?? true,
        });
      } catch (error) {
        console.error("Failed to load user:", error);
        toast.error(error.response?.data?.message || "Failed to load user");
        navigate("/users");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id, navigate]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((previous) => ({ ...previous, [name]: type === "checkbox" ? checked : value,}));
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

    try {
      setSaving(true);

      await api.put(`/users/${id}`, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        isActive: formData.isActive,
      });

      toast.success("User updated successfully");

      setTimeout(() => {
        navigate("/users");
      }, 2000);
    } catch (error) {
      console.error("Failed to update user:", error);

      toast.error(error.response?.data?.message || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-user-page">
        <div className="edit-user-loading">Loading user...</div>
      </div>
    );
  }

  return (
    <div className="edit-user-page">
      <div className="edit-user-header">
        <div>
          <h1>Edit User</h1>
          <p>Update user account details</p>
        </div>

        <button type="button" className="edit-user-back-button" onClick={() => navigate("/users")}>
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
      </div>

      <form className="edit-user-card" onSubmit={handleSubmit}>
        <div className="edit-user-form-grid">
          <div className="edit-user-field">
            <label htmlFor="name">Name</label>

            <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} placeholder="Enter name" />
          </div>

          <div className="edit-user-field">
            <label htmlFor="email">Email</label>

            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter email" />
          </div>

          <div className="edit-user-field">
            <label htmlFor="role">Role</label>

            <select id="role" name="role" value={formData.role} onChange={handleChange}>
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
              <option value="client">Client</option>
            </select>
          </div>

          <div className="edit-user-field edit-user-status-field">
            <label htmlFor="isActive">Status</label>

            <label className="edit-user-checkbox-label">
              <input id="isActive" name="isActive" type="checkbox" checked={formData.isActive} onChange={handleChange} />
              <span>Active</span>
            </label>
          </div>
        </div>

        <div className="edit-user-actions">
          <button type="submit" className="edit-user-submit-button" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditUser;