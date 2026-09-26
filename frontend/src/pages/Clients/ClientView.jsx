import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getClientById } from "../../services/clientService";
import "./Clients.css";

function ClientView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {

    const loadClient = async () => {
      try {
        const data = await getClientById(id);
        console.log("CLIENT VIEW DATA:", data);
        setClient(data.client || data.data);

      } catch (error) {
        console.error("Get client error:", error);
      } finally {
        setLoading(false);
      }

    };

    loadClient();
  }, [id]);

  if (loading) {

    return (
      <div className="clients-page">
        <div className="clients-empty">
          <p>Loading client...</p>

        </div>
      </div>

    );

  }

  if (!client) {

    return (
      <div className="clients-page">
        <div className="clients-empty">
          <h2>Client Not Found</h2>
          <button type="button" className="back-client-button" onClick={() => navigate("/clients")}>
            Back to Clients
          </button>

        </div>
      </div>
    );

  }

  return (

    <div className="clients-page">
      <div className="clients-header">
        <div>

          <h1>{client.companyName}</h1>
          <p>Client details</p>

        </div>

        <button type="button" className="back-client-button" onClick={() => navigate("/clients")}>
          Back
        </button>
      </div>

      <div className="client-form-card">
        <div className="client-details">
          <div>

            <strong>Company Name</strong>
            <p>{client.companyName || "-"}</p>

          </div>
          <div>

            <strong>Contact Person</strong>
            <p>{client.contactPerson || "-"}</p>

          </div>
          <div>

            <strong>Email</strong>
            <p>{client.email || "-"}</p>

          </div>
          <div>

            <strong>Phone</strong>
            <p>{client.phone || "-"}</p>

          </div>
          <div>

            <strong>Website</strong>
            {client.website ? (
              <a href={client.website} target="_blank" rel="noopener noreferrer"> {client.website}</a>) : (<p>-</p>
            )}

          </div>
          <div>

            <strong>Industry</strong>
            <p>{client.industry || "-"}</p>

          </div>
          <div>

            <strong>Address</strong>
            <p>{client.address || "-"}</p>

          </div>
          <div>

            <strong>Status</strong>
            <p>{client.status || "-"}</p>

          </div>
        </div>

        <button type="button" className="add-client-button" onClick={() => navigate(`/clients/${client._id}`)}>
          Edit Client
        </button>

      </div>
    </div>

  );

}

export default ClientView;