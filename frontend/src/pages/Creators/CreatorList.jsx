import { useEffect, useState } from "react";
import { Search, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCreators, deleteCreator } from "../../services/creatorService";
import "./Creators.css";

function CreatorList() {
  const navigate = useNavigate();

  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadCreators = async () => {
      try {
        const data = await getCreators();
        setCreators(data.creators || data.data || []);
      } catch (error) 
      {
        console.error("Get creators error:", error);
        toast.error(error.response?.data?.message || "Failed to load creators");
      } finally {
        setLoading(false);
      }
    };

    loadCreators();
  }, []);

  const handleDelete = (id) => {
    toast(({ closeToast }) => (
        <div>
          <p style={{ margin: "0 0 12px", fontWeight: "600", color: "#111827" }}>
            Are you sure you want to delete this creator?
          </p>

          <div style={{ display: "flex", gap: "8px" }}>
            <button type="button" onClick={async () => {closeToast();
                try {
                  await deleteCreator(id);
                  setCreators((prev) => prev.filter((creator) => creator._id !== id));
                  toast.success("Creator deleted successfully");
                } catch (error) 
                {
                  console.error("Delete creator error:", error);
                  toast.error(error.response?.data?.message || "Failed to delete creator");
                }
              }}
              style={{
                border: "none",
                background: "#dc2626",
                color: "#ffffff",
                padding: "7px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
              }}>
              Yes, Delete
            </button>

            <button type="button" onClick={closeToast}
              style={{
                border: "1px solid #d1d5db",
                background: "#ffffff",
                color: "#374151",
                padding: "7px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
              }}>
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
      }
    );
  };

  const filteredCreators = creators.filter((creator) => {
    const searchText = search.toLowerCase().trim();
    const name = creator.name?.toLowerCase() || "";
    const email = creator.email?.toLowerCase() || "";
    const category = creator.category?.toLowerCase() || "";
    const platform = creator.platform?.toLowerCase() || "";
    const location = creator.location?.toLowerCase() || "";
    const status = creator.status?.toLowerCase() || "";

    return (
      name.includes(searchText) ||
      email.includes(searchText) ||
      category.includes(searchText) ||
      platform.includes(searchText) ||
      location.includes(searchText) ||
      status.includes(searchText)
    );
  });

  const formatFollowers = (followers) => {
    const count = Number(followers || 0);
    if (count >= 1000000) 
    {
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
        ?.replace(/\b\w/g, (char) => char.toUpperCase()) || "-"
    );
  };

  return (
    <div className="creators-page">
      <div className="creators-header">
        <div>
          <h1>Creators</h1>
          <p>
            Manage all your creators • {creators.length}{" "}
            {creators.length === 1 ? "creator" : "creators"}
          </p>
        </div>

        <button type="button" className="add-creator-button" onClick={() => navigate("/creators/add")}>
          Add Creator
        </button>
      </div>

      <div className="creator-search-box">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search creators by name, email, category..." />

        <Search size={19} className="creator-search-icon" />
      </div>

      {loading ? (
        <div className="creators-empty">
          <p>Loading creators...</p>
        </div>
      ) : creators.length === 0 ? (
        <div className="creators-empty">
          <Users size={40} />

          <h2>No Creators Found</h2>

          <p>Add your first creator to start managing your creator network.</p>
        </div>
      ) : filteredCreators.length === 0 ? (
        <div className="creators-empty">
          <Search size={40} />

          <h2>No Creators Found</h2>

          <p>No creator matches your search. Try a different search term.</p>
        </div>
      ) : (
        <div className="creators-list">
          {filteredCreators.map((creator) => (
            <div className="creator-card" key={creator._id}>
              <div className="creator-card-header">
                <div className="creator-avatar">
                  {creator.name?.charAt(0)?.toUpperCase() || "C"}
                </div>

                <div className="creator-card-title">
                  <h3>{creator.name}</h3>

                  <p>{creator.email}</p>
                </div>

                <span className={`creator-status-badge status-${creator.status}`}>
                  {formatStatus(creator.status)}
                </span>
              </div>

              <div className="creator-card-info">
                <div>
                  <span>Category</span>

                  <strong>{creator.category || "-"}</strong>
                </div>

                <div>
                  <span>Platform</span>

                  <strong>{creator.platform || "-"}</strong>
                </div>

                <div>
                  <span>Followers</span>

                  <strong>{formatFollowers(creator.followers)}</strong>
                </div>

                <div>
                  <span>Location</span>

                  <strong>{creator.location || "-"}</strong>
                </div>
              </div>

              {creator.phone && (
                <div className="creator-contact">
                  <span>Phone</span>

                  <strong>{creator.phone}</strong>
                </div>
              )}

              <div className="creator-card-actions">
                <button type="button" className="view-creator-button" onClick={() => navigate(`/creators/view/${creator._id}`)}>
                  View
                </button>

                <button type="button" className="edit-creator-button" onClick={() => navigate(`/creators/${creator._id}`)}>
                  Edit
                </button>

                <button type="button" className="delete-creator-button" onClick={() => handleDelete(creator._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
    </div>
  );
}

export default CreatorList;