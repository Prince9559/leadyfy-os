import { useEffect, useState } from "react";
import { FileText, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getScripts, deleteScript } from "../../services/scriptService";

import "./Scripts.css";

function ScriptList() {
  const navigate = useNavigate();
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadScripts = async () => {
      try {
        const data = await getScripts();
        setScripts(data.scripts || data.data || []);
      } catch (error) {
        console.error("Get scripts error:", error);

        toast.error(error.response?.data?.message || "Failed to load scripts");
      } finally {
        setLoading(false);
      }
    };

    loadScripts();
  }, []);

  const handleDelete = (id) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p style={{ margin: "0 0 12px", fontWeight: "600", color: "#111827" }}>
            Are you sure you want to delete this script?
          </p>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={async () => {
                closeToast();

                try {
                  await deleteScript(id);
                  setScripts((prev) => prev.filter((script) => script._id !== id));
                  toast.success("Script deleted successfully");
                } catch (error) {
                  console.error("Delete script error:", error);

                  toast.error(error.response?.data?.message || "Failed to delete script");
                }
              }}
              style={{ border: "none", background: "#dc2626", color: "#ffffff", padding: "7px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>
              Yes, Delete
            </button>

            <button type="button" onClick={closeToast} style={{ border: "1px solid #d1d5db", background: "#ffffff", color: "#374151", padding: "7px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>
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

  const filteredScripts = scripts.filter((script) => {
    const searchText = search.toLowerCase().trim();

    const title = script.title?.toLowerCase() || "";
    const clientName = script.client?.companyName?.toLowerCase() || "";
    const orderName = script.order?.packageName?.toLowerCase() || "";
    const status = script.status?.toLowerCase() || "";

    return (
      title.includes(searchText) ||
      clientName.includes(searchText) ||
      orderName.includes(searchText) ||
      status.includes(searchText)
    );
  });

  const formatStatus = (status) => {
    return status?.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="scripts-page">
      <div className="scripts-header">
        <div>
          <h1>Scripts</h1>
          <p>
            Manage all your scripts • {scripts.length}{" "}
            {scripts.length === 1 ? "script" : "scripts"}
          </p>
        </div>

        <button type="button" className="add-script-button" onClick={() => navigate("/scripts/add")}>
          Add Script
        </button>
      </div>

      <div className="script-search-box">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search scripts by title, client or status..." />

        <Search size={19} className="script-search-icon" />
      </div>

      {loading ? (
        <div className="scripts-empty">
          <p>Loading scripts...</p>
        </div>
      ) : scripts.length === 0 ? (
        <div className="scripts-empty">
          <FileText size={40} />

          <h2>No Scripts Found</h2>

          <p>Add your first script to start managing your content.</p>
        </div>
      ) : filteredScripts.length === 0 ? (
        <div className="scripts-empty">
          <Search size={40} />

          <h2>No Scripts Found</h2>

          <p>No script matches your search. Try a different search term.</p>
        </div>
      ) : (
        <div className="scripts-list">
          {filteredScripts.map((script) => (
            <div className="script-card" key={script._id}>
              <div className="script-card-header">
                <div>
                  <h3>{script.title}</h3>

                  <p className="script-client-name">
                    {script.client?.companyName || "Unknown Client"}
                  </p>
                </div>

                <span className={`script-status-badge status-${script.status}`}>
                  {formatStatus(script.status)}
                </span>
              </div>

              <div className="script-card-info">
                <div>
                  <span>Order</span>

                  <strong>{script.order?.packageName || "-"}</strong>
                </div>

                <div>
                  <span>Assigned To</span>

                  <strong>{script.assignedTo?.name || "-"}</strong>
                </div>
              </div>

              <p className="script-content-preview">
                {script.content ? script.content.length > 150 ? `${script.content.substring(0, 150)}...` : script.content : "No script content available."}
              </p>

              <div className="script-card-actions">
                <button type="button" className="view-script-button" onClick={() => navigate(`/scripts/view/${script._id}`)}>
                  View
                </button>

                <button type="button" className="edit-script-button" onClick={() => navigate(`/scripts/${script._id}`)}>
                  Edit
                </button>

                <button type="button" className="delete-script-button" onClick={() => handleDelete(script._id)}>
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

export default ScriptList;