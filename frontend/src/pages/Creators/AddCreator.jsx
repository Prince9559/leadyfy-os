import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { createCreator } from "../../services/creatorService";

import "./Creators.css";

function AddCreator() {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    platform: "",
    followers: "",
    location: "",
    profileUrl: "",
    status: "active",
    notes: "",
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

    if (!formData.name.trim()) {
      toast.error("Creator name is required");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    try {
      setSaving(true);

      await createCreator({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        category: formData.category.trim() || undefined,
        platform: formData.platform.trim() || undefined,
        followers: Number(formData.followers || 0),
        location: formData.location.trim() || undefined,
        profileUrl: formData.profileUrl.trim() || undefined,
        status: formData.status,
        notes: formData.notes.trim() || undefined,
      });

      toast.success("Creator created successfully");

      setTimeout(() => {
        navigate("/creators");
      }, 800);
    } catch (error) {
      console.error("Create creator error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to create creator"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="creators-page">
      {/* Header */}
      <div className="creators-header">
        <div>
          <h1>Add Creator</h1>
          <p>Add a new creator to your network</p>
        </div>

        <button
          type="button"
          className="back-creator-button"
          onClick={() => navigate("/creators")}
        >
          Back
        </button>
      </div>

      {/* Form Card */}
      <div className="creator-form-card">
        <form onSubmit={handleSubmit}>
          <div className="creator-form-grid">
            {/* Creator Name */}
            <div className="creator-form-group">
              <label htmlFor="name">
                Creator Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter creator name"
              />
            </div>

            {/* Email */}
            <div className="creator-form-group">
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
              />
            </div>

            {/* Phone */}
            <div className="creator-form-group">
              <label htmlFor="phone">
                Phone
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>

            {/* Category */}
            <div className="creator-form-group">
              <label htmlFor="category">
                Category
              </label>

              <input
                id="category"
                name="category"
                type="text"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Fashion, Tech, Fitness"
              />
            </div>

            {/* Platform */}
            <div className="creator-form-group">
              <label htmlFor="platform">
                Platform
              </label>

              <input
                id="platform"
                name="platform"
                type="text"
                value={formData.platform}
                onChange={handleChange}
                placeholder="e.g. Instagram, YouTube"
              />
            </div>

            {/* Followers */}
            <div className="creator-form-group">
              <label htmlFor="followers">
                Followers
              </label>

              <input
                id="followers"
                name="followers"
                type="number"
                min="0"
                value={formData.followers}
                onChange={handleChange}
                placeholder="Enter follower count"
              />
            </div>

            {/* Location */}
            <div className="creator-form-group">
              <label htmlFor="location">
                Location
              </label>

              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Varanasi, India"
              />
            </div>

            {/* Profile URL */}
            <div className="creator-form-group">
              <label htmlFor="profileUrl">
                Profile URL
              </label>

              <input
                id="profileUrl"
                name="profileUrl"
                type="url"
                value={formData.profileUrl}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            {/* Status */}
            <div className="creator-form-group">
              <label htmlFor="status">
                Status
              </label>

              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>
              </select>
            </div>

            {/* Notes */}
            <div className="creator-form-group creator-form-full">
              <label htmlFor="notes">
                Notes
              </label>

              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any additional notes..."
                rows="6"
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="save-creator-button"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Creator"}
          </button>
        </form>
      </div>

      {/* Toast */}
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

export default AddCreator;