import { useEffect, useState } from "react";
import { Users, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getClients, deleteClient } from "../../services/clientService";
import "./Clients.css";

function ClientList() {
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadClients = async () => {
      try {
        const data = await getClients();
        setClients(data.clients || data.data || []);
      } catch (error) {
        console.error("Get clients error:", error);
        toast.error(error.response?.data?.message || "Failed to load clients");
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, []);

  const handleDelete = (id) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p style={{ margin: "0 0 12px", fontWeight: "600", color: "#111827" }}>
            Are you sure you want to delete this client?
          </p>

          <div style={{ display: "flex", gap: "8px" }}>
            <button type="button" onClick={async () => {
              closeToast();

              try {
                await deleteClient(id);
                setClients((prev) => prev.filter((client) => client._id !== id));
                toast.success("Client deleted successfully");
              } catch (error) {
                console.error("Delete client error:", error);
                toast.error(error.response?.data?.message || "Failed to delete client");
              }
            }} style={{ border: "none", background: "#dc2626", color: "#ffffff", padding: "7px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>
              Yes, Delete
            </button>

            <button type="button" onClick={closeToast} style={{ border: "1px solid #d1d5db", background: "#ffffff", color: "#374151", padding: "7px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>
              Cancel
            </button>
          </div>
        </div>
      ),
      { autoClose: false, closeOnClick: false, closeButton: false }
    );
  };

  const filteredClients = clients.filter((client) => {
    const searchText = search.toLowerCase().trim();
    return (
      client.companyName?.toLowerCase().includes(searchText) ||
      client.contactPerson?.toLowerCase().includes(searchText) ||
      client.email?.toLowerCase().includes(searchText) ||
      client.phone?.includes(searchText)
    );
  });

  return (
    <div className="clients-page">
      <div className="clients-header">
        <div>
          <h1>Clients</h1>
          <p>Manage all your clients • {clients.length} {clients.length === 1 ? "client" : "clients"}</p>
        </div>

        <button type="button" className="add-client-button" onClick={() => navigate("/clients/add")}>Add Client</button>
      </div>

      <div className="client-search-box">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search clients by company, contact or email..." />
        <Search size={19} className="client-search-icon" />
      </div>

      {loading ? (
        <div className="clients-empty">
          <p>Loading clients...</p>
        </div>
      ) : clients.length === 0 ? (
        <div className="clients-empty">
          <Users size={40} />
          <h2>No Clients Found</h2>
          <p>Add your first client to start managing your client records.</p>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="clients-empty">
          <Search size={40} />
          <h2>No Clients Found</h2>
          <p>No client matches your search. Try a different search term.</p>
        </div>
      ) : (
        <div className="clients-list">
          {filteredClients.map((client) => (
            <div className="client-card" key={client._id}>
              <h3 className="client-name-link" onClick={() => navigate(`/clients/${client._id}`)}>{client.companyName}</h3>

              <p>{client.email}</p>
              <p>{client.phone}</p>
              <p>Contact: {client.contactPerson}</p>

              <p className="client-status">
                <span className={`status-badge ${client.status === "active" ? "status-active" : "status-inactive"}`}>
                  {client.status || "inactive"}
                </span>
              </p>

              <div className="client-card-actions">
                <button type="button" className="view-client-button" onClick={() => navigate(`/clients/view/${client._id}`)}>View</button>
                <button type="button" className="edit-client-button" onClick={() => navigate(`/clients/${client._id}`)}>Edit</button>
                <button type="button" className="delete-client-button" onClick={() => handleDelete(client._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
    </div>
  );
}

export default ClientList;