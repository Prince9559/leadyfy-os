import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getShootById } from "../../services/shootService";

import "./Shoots.css";

function ShootView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [shoot, setShoot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadShoot = async () => {
      try {
        const data = await getShootById(id);

        const shootData =
          data.shoot ||
          data.data;

        if (!shootData) {
          toast.error("Shoot not found");
          return;
        }

        setShoot(shootData);
      } catch (error) {
        console.error(
          "Get shoot error:",
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

    loadShoot();
  }, [id]);

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  const formatStatus = (status) => {
    return (
      status
        ?.replace(/_/g, " ")
        .replace(/\b\w/g, (char) =>
          char.toUpperCase()
        ) || "-"
    );
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

  if (!shoot) {
    return (
      <div className="shoots-page">
        <div className="shoots-empty">
          <h2>Shoot Not Found</h2>

          <p>
            The shoot you are looking for
            does not exist.
          </p>

          <button
            type="button"
            className="back-shoot-button"
            onClick={() =>
              navigate("/shoots")
            }
          >
            Back
          </button>
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

  return (
    <div className="shoots-page">
      <div className="shoots-header">
        <div>
          <h1>Shoot Details</h1>

          <p>
            View shoot information
          </p>
        </div>

        <button
          type="button"
          className="back-shoot-button"
          onClick={() =>
            navigate("/shoots")
          }
        >
          Back
        </button>
      </div>

      <div className="shoot-view-card">
        <div className="shoot-view-header">
          <div>
            <h2>
              {shoot.creator?.name ||
                "Shoot"}
            </h2>

            <p>
              {formatDate(
                shoot.shootDate
              )}
            </p>
          </div>

          <span
            className={`shoot-status-badge status-${shoot.status}`}
          >
            {formatStatus(
              shoot.status
            )}
          </span>
        </div>

        <div className="shoot-view-grid">
          <div className="shoot-view-item">
            <span>Client</span>

            <strong>
              {shoot.client?.companyName ||
                "-"}
            </strong>
          </div>

          <div className="shoot-view-item">
            <span>Order</span>

            <strong>
              {shoot.order?.packageName ||
                "-"}
            </strong>
          </div>

          <div className="shoot-view-item">
            <span>Creator</span>

            <strong>
              {shoot.creator?.name ||
                "-"}
            </strong>
          </div>

          <div className="shoot-view-item">
            <span>Shoot Date</span>

            <strong>
              {formatDate(
                shoot.shootDate
              )}
            </strong>
          </div>

          <div className="shoot-view-item">
            <span>Start Time</span>

            <strong>
              {shoot.startTime || "-"}
            </strong>
          </div>

          <div className="shoot-view-item">
            <span>End Time</span>

            <strong>
              {shoot.endTime || "-"}
            </strong>
          </div>

          <div className="shoot-view-item">
            <span>Location</span>

            <strong>
              {shoot.location || "-"}
            </strong>
          </div>

          <div className="shoot-view-item">
            <span>Status</span>

            <strong>
              {formatStatus(
                shoot.status
              )}
            </strong>
          </div>
        </div>

        <div className="shoot-view-notes">
          <span>Notes</span>

          <p>
            {shoot.notes ||
              "No notes available."}
          </p>
        </div>

        <div className="shoot-view-actions">
          <button
            type="button"
            className="edit-shoot-button"
            onClick={() =>
              navigate(
                `/shoots/${shoot._id}`
              )
            }
          >
            Edit Shoot
          </button>
        </div>
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

export default ShootView;