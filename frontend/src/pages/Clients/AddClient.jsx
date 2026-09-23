
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { createClient } from "../../services/clientService";

import "./Clients.css";

function AddClient() {
  const navigate = useNavigate();

const [formData, setFormData] = useState({
  companyName: "",
  contactPerson: "",
  email: "",
  phone: "",
  website: "",
  industry: "",
  address: "",
  status: "active",
});
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.companyName.trim()) {
      toast.error("Company name is required");
      return;
    }

    if (!formData.contactPerson.trim()) {
      toast.error("Contact person is required");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.email.trim())) {
  toast.error("Please enter a valid Gmail address");
  return;
}

    if (
      formData.phone.trim() &&
      !/^\d{10}$/.test(formData.phone)
    ) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      await createClient(formData);

      toast.success("Client created successfully");

      setFormData({
  companyName: "",
  contactPerson: "",
  email: "",
  phone: "",
  website: "",
  industry: "",
  address: "",
  status: "active",
});
    } catch (error) {
      console.error("Create client error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to create client"
      );
    }
  };

  return (
    <div className="clients-page">
      <div className="clients-header">
        <div>
          <h1>Add Client</h1>
          <p>Create a new client</p>
        </div>

        <button
          type="button"
          className="back-client-button"
          onClick={() => navigate("/clients")}
        >
          Back
        </button>
      </div>

      <div className="client-form-card">
        <form onSubmit={handleSubmit}>
          <div className="client-form-grid">
            <div className="client-form-group">
              <label htmlFor="companyName">
                Company Name
              </label>

              <input
                id="companyName"
                name="companyName"
                type="text"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter company name"
              />
            </div>

            <div className="client-form-group">
              <label htmlFor="contactPerson">
                Contact Person
              </label>

              <input
                id="contactPerson"
                name="contactPerson"
                type="text"
                value={formData.contactPerson}
                onChange={handleChange}
                placeholder="Enter contact person"
              />
            </div>

            <div className="client-form-group">
              <label htmlFor="email">Email</label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
            </div>

            <div className="client-form-group">
              <label htmlFor="phone">Phone</label>

              <input
                id="phone"
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>

            <div className="client-form-group">
              <label htmlFor="website">Website</label>

              <input
                id="website"
                name="website"
                type="text"
                value={formData.website}
                onChange={handleChange}
                placeholder="Enter website"
              />
            </div>

            <div className="client-form-group">
              <label htmlFor="industry">Industry</label>

              <input
                id="industry"
                name="industry"
                type="text"
                value={formData.industry}
                onChange={handleChange}
                placeholder="Enter industry"
              />
            </div>

            <div className="client-form-group">
              <label htmlFor="address">Address</label>

              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
              />
            </div>

            <div className="client-form-group">
  <label htmlFor="status">Status</label>

  <select
    id="status"
    name="status"
    value={formData.status}
    onChange={handleChange}
  >
    <option value="active">Active</option>
    <option value="inactive">Inactive</option>
  </select>
</div>
          </div>

          <button
            type="submit"
            className="add-client-button"
          >
            Save Client
          </button>
        </form>
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

export default AddClient;

