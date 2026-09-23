import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  getShootById,
  updateShoot,
} from "../../services/shootService";

import { getClients } from "../../services/clientService";
import { getOrders } from "../../services/orderService";
import { getCreators } from "../../services/creatorService";

import "./Shoots.css";

function EditShoot() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [orders, setOrders] = useState([]);
  const [creators, setCreators] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    client: "",
    order: "",
    creator: "",
    shootDate: "",
    startTime: "",
    endTime: "",
    location: "",
    status: "scheduled",
    notes: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          shootData,
          clientData,
          orderData,
          creatorData,
        ] = await Promise.all([
          getShootById(id),
          getClients(),
          getOrders(),
          getCreators(),
        ]);

        const shoot =
          shootData.shoot ||
          shootData.data;

        if (!shoot) {
          toast.error("Shoot not found");
          return;
        }

        setClients(
          clientData.clients ||
            clientData.data ||
            []
        );

        setOrders(
          orderData.orders ||
            orderData.data ||
            []
        );

        setCreators(
          creatorData.creators ||
            creatorData.data ||
            []
        );

        setFormData({
          client:
            shoot.client?._id ||
            shoot.client ||
            "",
          order:
            shoot.order?._id ||
            shoot.order ||
            "",
          creator:
            shoot.creator?._id ||
            shoot.creator ||
            "",
          shootDate: shoot.shootDate
            ? new Date(shoot.shootDate)
                .toISOString()
                .split("T")[0]
            : "",
          startTime:
            shoot.startTime || "",
          endTime:
            shoot.endTime || "",
          location:
            shoot.location || "",
          status:
            shoot.status || "scheduled",
          notes:
            shoot.notes || "",
        });
      } catch (error) {
        console.error(
          "Load edit shoot data error:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to load shoot"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.client) {
      toast.error("Please select a client");
      return;
    }

    if (!formData.order) {
      toast.error("Please select an order");
      return;
    }

    if (!formData.creator) {
      toast.error("Please select a creator");
      return;
    }

    if (!formData.shootDate) {
      toast.error("Shoot date is required");
      return;
    }

    if (!formData.startTime) {
      toast.error("Start time is required");
      return;
    }

    if (!formData.endTime) {
      toast.error("End time is required");
      return;
    }

    try {
      setSaving(true);

      await updateShoot(id, {
        client: formData.client,
        order: formData.order,
        creator: formData.creator,
        shootDate: formData.shootDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location:
          formData.location.trim() ||
          undefined,
        status: formData.status,
        notes:
          formData.notes.trim() ||
          undefined,
      });

      toast.success(
        "Shoot updated successfully"
      );

      setTimeout(() => {
        navigate(
          `/shoots/view/${id}`
        );
      }, 800);
    } catch (error) {
      console.error(
        "Update shoot error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update shoot"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="shoots-page">
        <div className="shoots-empty">
          <p>Loading shoot...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="shoots-page">
      <div className="shoots-header">
        <div>
          <h1>Edit Shoot</h1>

          <p>
            Update shoot information
          </p>
        </div>

        <button
          type="button"
          className="back-shoot-button"
          onClick={() =>
            navigate(
              `/shoots/view/${id}`
            )
          }
        >
          Back
        </button>
      </div>

      <div className="shoot-form-card">
        <form onSubmit={handleSubmit}>
          <div className="shoot-form-grid">
            <div className="shoot-form-group">
              <label htmlFor="client">
                Client
              </label>

              <select
                id="client"
                name="client"
                value={formData.client}
                onChange={handleChange}
              >
                <option value="">
                  Select client
                </option>

                {clients.map((client) => (
                  <option
                    key={client._id}
                    value={client._id}
                  >
                    {client.companyName}
                  </option>
                ))}
              </select>
            </div>

            <div className="shoot-form-group">
              <label htmlFor="order">
                Order
              </label>

              <select
                id="order"
                name="order"
                value={formData.order}
                onChange={handleChange}
              >
                <option value="">
                  Select order
                </option>

                {orders.map((order) => (
                  <option
                    key={order._id}
                    value={order._id}
                  >
                    {order.packageName} -{" "}
                    {order.client?.companyName ||
                      "Unknown Client"}
                  </option>
                ))}
              </select>
            </div>

            <div className="shoot-form-group">
              <label htmlFor="creator">
                Creator
              </label>

              <select
                id="creator"
                name="creator"
                value={formData.creator}
                onChange={handleChange}
              >
                <option value="">
                  Select creator
                </option>

                {creators.map((creator) => (
                  <option
                    key={creator._id}
                    value={creator._id}
                  >
                    {creator.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="shoot-form-group">
              <label htmlFor="shootDate">
                Shoot Date
              </label>

              <input
                id="shootDate"
                name="shootDate"
                type="date"
                value={formData.shootDate}
                onChange={handleChange}
              />
            </div>

            <div className="shoot-form-group">
              <label htmlFor="startTime">
                Start Time
              </label>

              <input
                id="startTime"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleChange}
              />
            </div>

            <div className="shoot-form-group">
              <label htmlFor="endTime">
                End Time
              </label>

              <input
                id="endTime"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleChange}
              />
            </div>

            <div className="shoot-form-group">
              <label htmlFor="location">
                Location
              </label>

              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter shoot location"
              />
            </div>

            <div className="shoot-form-group">
              <label htmlFor="status">
                Status
              </label>

              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="scheduled">
                  Scheduled
                </option>

                <option value="confirmed">
                  Confirmed
                </option>

                <option value="in_progress">
                  In Progress
                </option>

                <option value="completed">
                  Completed
                </option>

                <option value="cancelled">
                  Cancelled
                </option>
              </select>
            </div>

            <div className="shoot-form-group shoot-form-full">
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

          <button
            type="submit"
            className="save-shoot-button"
            disabled={saving}
          >
            {saving
              ? "Updating..."
              : "Update Shoot"}
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

export default EditShoot;