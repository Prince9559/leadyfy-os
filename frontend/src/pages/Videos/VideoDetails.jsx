import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil, ExternalLink } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getVideoById } from "../../services/videoService";
import "./Videos.css";

function VideoDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const data = await getVideoById(id);
        setVideo(data.video);
      } catch (error) {
        console.error("Get video error:", error);
        toast.error(error.response?.data?.message || "Failed to load video");
      } finally {
        setLoading(false);
      }
    };

    loadVideo();
  }, [id]);

  const formatStatus = (status) => {
    if (!status) return "-";
    return status.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatDuration = (duration) => {
    if (duration === undefined || duration === null || duration === "") return "-";
    const totalSeconds = Number(duration);
    if (Number.isNaN(totalSeconds)) return "-";
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="videos-page">
        <div className="videos-empty"><p>Loading video...</p></div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="videos-page">
        <div className="videos-empty">
          <h2>Video Not Found</h2>
          <button type="button" className="video-back-button" onClick={() => navigate("/videos")}>Back</button>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    );
  }

  return (
    <div className="videos-page">
      <div className="videos-header">
        <div><h1>{video.title || "Video Details"}</h1><p>View complete information about this video.</p></div>
        <div className="video-details-header-actions">
          <button type="button" className="video-back-button" onClick={() => navigate("/videos")}>Back</button>
        </div>
      </div>

      <div className="video-details-card">
        <div className="video-details-media">
          {video.videoUrl ? (
            <video src={video.videoUrl} controls poster={video.thumbnailUrl || undefined} className="video-player">
              Your browser does not support video playback.
            </video>
          ) : video.thumbnailUrl ? (
            <img src={video.thumbnailUrl} alt={video.title || "Video"} className="video-details-thumbnail" />
          ) : (
            <div className="video-details-placeholder">No Video Preview</div>
          )}
        </div>

        <div className="video-details-content">
          <div className="video-details-title-row">
            <div>
              <h2>{video.title || "-"}</h2>
              <span className={`video-status video-status-${video.status}`}>{formatStatus(video.status)}</span>
            </div>
          </div>

          <div className="video-details-grid">
            <div className="video-detail-item"><span>Client</span><strong>{video.client?.companyName || "-"}</strong></div>
            <div className="video-detail-item"><span>Contact Person</span><strong>{video.client?.contactPerson || "-"}</strong></div>
            <div className="video-detail-item"><span>Client Email</span><strong>{video.client?.email || "-"}</strong></div>
            <div className="video-detail-item"><span>Order</span><strong>{video.order?.packageName || "-"}</strong></div>
            <div className="video-detail-item"><span>Package Type</span><strong>{video.order?.packageType || "-"}</strong></div>
            <div className="video-detail-item"><span>Script</span><strong>{video.script?.title || "-"}</strong></div>
            <div className="video-detail-item"><span>Assigned Editor</span><strong>{video.assignedEditor?.name || "-"}</strong></div>
            <div className="video-detail-item"><span>Editor Email</span><strong>{video.assignedEditor?.email || "-"}</strong></div>
            <div className="video-detail-item"><span>Duration</span><strong>{formatDuration(video.duration)}</strong></div>
            <div className="video-detail-item"><span>Created By</span><strong>{video.createdBy?.name || "-"}</strong></div>
          </div>

          {video.videoUrl && (
            <div className="video-details-url">
              <span>Video URL</span>
              <a href={video.videoUrl} target="_blank" rel="noopener noreferrer">Open Video <ExternalLink size={15} /></a>
            </div>
          )}

          {video.notes && (
            <div className="video-details-notes">
              <span>Notes</span>
              <p>{video.notes}</p>
            </div>
          )}

          <div className="video-details-bottom-actions">
            <button type="button" className="video-edit-button" onClick={() => navigate(`/videos/${video._id}`)}>
              <Pencil size={18} /> Edit
            </button>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
    </div>
  );
}

export default VideoDetails;