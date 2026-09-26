import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Pencil, Eye, Plus } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getVideos, deleteVideo } from "../../services/videoService";
import "./Videos.css";

function VideoList() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const data = await getVideos();
        setVideos(data.videos || []);
      } catch (error) {
        console.error("Get videos error:", error);
        toast.error(error.response?.data?.message || "Failed to load videos");
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

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

  const handleDelete = (video) => {
    if (!video?._id) return;

    toast(
      ({ closeToast }) => (
        <div>
          <p style={{ margin: "0 0 12px", fontWeight: "600" }}>Are you sure you want to delete this video?</p>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={async () => {
                try {
                  await deleteVideo(video._id);
                  setVideos((prev) => prev.filter((item) => item._id !== video._id));
                  closeToast();
                  toast.success("Video deleted successfully");
                } catch (error) {
                  console.error("Delete video error:", error);
                  closeToast();
                  toast.error(error.response?.data?.message || "Failed to delete video");
                }
              }}
              style={{ border: "none", borderRadius: "6px", padding: "7px 12px", background: "#dc2626", color: "#ffffff", cursor: "pointer", fontWeight: "600" }}>
              Confirm Delete
            </button>

            <button type="button" onClick={closeToast} style={{ border: "1px solid #d1d5db", borderRadius: "6px", padding: "7px 12px", background: "#ffffff", color: "#374151", cursor: "pointer", fontWeight: "600" }}>
              Cancel
            </button>
          </div>
        </div>
      ),
      { autoClose: false, closeOnClick: false, closeButton: false }
    );
  };

  return (
    <div className="videos-page">
      <div className="videos-header">
        <div>
          <h1>Videos</h1>
          <p>Manage and track all your videos • {videos.length} {videos.length === 1 ? "video" : "videos"}</p>
        </div>

        <button type="button" className="add-video-button" onClick={() => navigate("/videos/add")}>
          <Plus size={18} /> Add Video
        </button>
      </div>

      {loading ? ( <div className="videos-empty"><p>Loading videos...</p></div>) : videos.length === 0 ? (
        <div className="videos-empty">
          <h2>No Videos Found</h2>
          <p>Add your first video to start managing your video workflow.</p>

          <button type="button" className="add-video-button" onClick={() => navigate("/videos/add")}>
            <Plus size={18} /> Add First Video
          </button>
        </div>
      ) : (
        <div className="videos-table-card">
          <div className="videos-table-wrapper">
            <table className="videos-table">
              <thead>
                <tr>
                  <th>Video</th>
                  <th>Client</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Editor</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {videos.map((video) => (
                  <tr key={video._id}>
                    <td>
                      <div className="video-title-cell">
                        {video.thumbnailUrl ? (<img src={video.thumbnailUrl} alt={video.title || "Video thumbnail"} className="video-thumbnail" />
                        ) : (
                          <div className="video-thumbnail-placeholder">Video</div>
                        )}

                        <div>
                          <strong>{video.title || "-"}</strong>
                          {video.script?.title && <span>Script: {video.script.title}</span>}
                        </div>
                      </div>
                    </td>

                    <td>{video.client?.companyName || "-"}</td>
                    <td>{video.order?.packageName || "-"}</td>

                    <td>
                      <span className={`video-status video-status-${video.status}`}>{formatStatus(video.status)}</span>
                    </td>

                    <td>{video.assignedEditor?.name || "-"}</td>
                    <td>{formatDuration(video.duration)}</td>

                    <td>
                      <div className="video-actions">
                        <button type="button" title="View" onClick={() => navigate(`/videos/view/${video._id}`)}><Eye size={17} /></button>
                        <button type="button" title="Edit" onClick={() => navigate(`/videos/${video._id}`)}><Pencil size={17} /></button>
                        <button type="button" title="Delete" className="video-delete-action" onClick={() => handleDelete(video)}><Trash2 size={17} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="videos-mobile-list">
            {videos.map((video) => (
              <div className="video-mobile-card" key={video._id}>
                <div className="video-mobile-top">
                  {video.thumbnailUrl ? (
                    <img src={video.thumbnailUrl} alt={video.title || "Video thumbnail"} className="video-mobile-thumbnail" />
                  ) : (
                    <div className="video-mobile-thumbnail-placeholder">Video</div>
                  )}

                  <div>
                    <h3>{video.title || "-"}</h3>
                    <span>{video.client?.companyName || "-"}</span>
                  </div>
                </div>

                <div className="video-mobile-details">
                  <div><span>Order</span><strong>{video.order?.packageName || "-"}</strong></div>
                  <div><span>Status</span><strong>{formatStatus(video.status)}</strong></div>
                  <div><span>Editor</span><strong>{video.assignedEditor?.name || "-"}</strong></div>
                  <div><span>Duration</span><strong>{formatDuration(video.duration)}</strong></div>
                </div>

                <div className="video-mobile-actions">
                  <button type="button" onClick={() => navigate(`/videos/view/${video._id}`)}><Eye size={16} /> View</button>
                  <button type="button" onClick={() => navigate(`/videos/${video._id}`)}><Pencil size={16} /> Edit</button>
                  <button type="button" className="video-mobile-delete" onClick={() => handleDelete(video)}><Trash2 size={16} /> Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
    </div>
  );
}

export default VideoList;