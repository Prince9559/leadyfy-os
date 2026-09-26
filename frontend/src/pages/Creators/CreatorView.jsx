import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCreatorById } from "../../services/creatorService";
import "./Creators.css";

function CreatorView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCreator = async () => {
      try {
        const data = await getCreatorById(id);
        const creatorData = data.creator || data.data;
        if (!creatorData) {
          toast.error("Creator not found");
          return;
        }

        setCreator(creatorData);
      } catch (error) {
        console.error("Get creator error:", error);
        toast.error(error.response?.data?.message || "Failed to load creator");
      } finally {
        setLoading(false);
      }
    };

    loadCreator();
  }, [id]);

  const formatFollowers = (followers) => 
  {
    const count = Number(followers || 0);
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }

    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }

    return count.toLocaleString("en-IN");
  };

  const formatStatus = (status) => {
    return (
      status
        ?.replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase()) || "-"
    );
  };

  if (loading) {
    return (
      <div className="creators-page">
        <div className="creators-empty">
          <p>Loading creator...</p>
        </div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="creators-page">
        <div className="creators-empty">
          <h2>Creator Not Found</h2>

          <p>The creator you are looking for does not exist.</p>

          <button type="button" className="back-creator-button" onClick={() => navigate("/creators")}>
            Back
          </button>
        </div>

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
      </div>
    );
  }

  return (
    <div className="creators-page">
        <div className="creators-header">
        <div>
          <h1>Creator Details</h1>

          <p>View creator information</p>
        </div>

        <button type="button" className="back-creator-button" onClick={() => navigate("/creators")}>
          Back
        </button>
      </div>

  
      <div className="creator-view-card">
        <div className="creator-view-header">
          <div className="creator-view-avatar">
            {creator.name?.charAt(0)?.toUpperCase() || "C"}
          </div>

          <div className="creator-view-title">
            <h2>{creator.name}</h2>

            <p>{creator.email}</p>
          </div>

          <span className={`creator-status-badge status-${creator.status}`}>
            {formatStatus(creator.status)}
          </span>
        </div>

        <div className="creator-view-grid">
          <div className="creator-view-item">
            <span>Phone</span>

            <strong>{creator.phone || "-"}</strong>
          </div>

          <div className="creator-view-item">
            <span>Category</span>

            <strong>{creator.category || "-"}</strong>
          </div>

          <div className="creator-view-item">
            <span>Platform</span>

            <strong>{creator.platform || "-"}</strong>
          </div>

          <div className="creator-view-item">
            <span>Followers</span>

            <strong>{formatFollowers(creator.followers)}</strong>
          </div>

          <div className="creator-view-item">
            <span>Location</span>

            <strong>{creator.location || "-"}</strong>
          </div>

          <div className="creator-view-item">
            <span>Profile URL</span>

            {creator.profileUrl ? (
              <a href={creator.profileUrl} target="_blank" rel="noreferrer" className="creator-profile-link">
                Visit Profile
              </a>
            ) : (
              <strong>-</strong>
            )}
          </div>
        </div>

        <div className="creator-view-notes">
          <span>Notes</span>

          <p>{creator.notes || "No notes available."}</p>
        </div>

        <div className="creator-view-actions">
          <button type="button" className="edit-creator-button" onClick={() => navigate(`/creators/${creator._id}`)}>
            Edit Creator
          </button>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
    </div>
  );
}

export default CreatorView;