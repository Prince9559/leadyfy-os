import { useEffect, useState } from "react";
import { Edit3, FileText } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getScriptById } from "../../services/scriptService";

import "./Scripts.css";

function ScriptDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [script, setScript] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadScript = async () => {
      try {
        const data = await getScriptById(id);

        setScript(data.script || data.data);
      } catch (error) {
        console.error("Get script error:", error);

        toast.error(
          error.response?.data?.message ||
            "Failed to load script"
        );
      } finally {
        setLoading(false);
      }
    };

    loadScript();
  }, [id]);

  const formatStatus = (status) => {
    return (
      status
        ?.replace(/_/g, " ")
        .replace(/\b\w/g, (char) =>
          char.toUpperCase()
        ) || "-"
    );
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="scripts-page">
        <div className="scripts-empty">
          <p>Loading script...</p>
        </div>
      </div>
    );
  }

  if (!script) {
    return (
      <div className="scripts-page">
        <div className="scripts-empty">
          <FileText size={40} />

          <h2>Script Not Found</h2>

          <p>
            The requested script could not be found.
          </p>

          <button
            type="button"
            className="back-script-button"
            onClick={() => navigate("/scripts")}
          >
            Back to Scripts
          </button>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
        />
      </div>
    );
  }

  return (
    <div className="scripts-page">
      <div className="scripts-header">
        <div>
          <h1>Script Details</h1>

          <p>
            View complete script information
          </p>
        </div>

        <button
  type="button"
  className="back-script-button"
  onClick={() => navigate("/scripts")}
>
  Back
</button>
      </div>

      <div className="script-details-card">
        <div className="script-details-top">
          <div>
            <span className="script-details-label">
              Script Title
            </span>

            <h2>{script.title}</h2>
          </div>

          <span
            className={`script-status-badge status-${script.status}`}
          >
            {formatStatus(script.status)}
          </span>
        </div>

        <div className="script-details-grid">
          <div className="script-detail-item">
            <span>Client</span>

            <strong>
              {script.client?.companyName ||
                "-"}
            </strong>
          </div>

          <div className="script-detail-item">
            <span>Order</span>

            <strong>
              {script.order?.packageName ||
                "-"}
            </strong>
          </div>

          <div className="script-detail-item">
            <span>Assigned To</span>

            <strong>
              {script.assignedTo?.name || "-"}
            </strong>
          </div>

          <div className="script-detail-item">
            <span>Created By</span>

            <strong>
              {script.createdBy?.name || "-"}
            </strong>
          </div>

          <div className="script-detail-item">
            <span>Created At</span>

            <strong>
              {formatDate(script.createdAt)}
            </strong>
          </div>

          <div className="script-detail-item">
            <span>Updated At</span>

            <strong>
              {formatDate(script.updatedAt)}
            </strong>
          </div>
        </div>

        <div className="script-details-section">
          <h3>Script Content</h3>

          <div className="script-content-box">
            {script.content || "No content available."}
          </div>
        </div>

        {script.revisionNote && (
          <div className="script-details-section">
            <h3>Revision Note</h3>

            <div className="script-revision-box">
              {script.revisionNote}
            </div>
          </div>
        )}

        {script.approvedAt && (
          <div className="script-details-section">
            <h3>Approved At</h3>

            <p className="script-approved-date">
              {formatDate(script.approvedAt)}
            </p>
          </div>
        )}

        <div className="script-details-actions">
           

          <button
            type="button"
            className="edit-script-details-button"
            onClick={() =>
              navigate(`/scripts/${script._id}`)
            }
          >
            <Edit3 size={16} />
            Edit Script
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

export default ScriptDetails;