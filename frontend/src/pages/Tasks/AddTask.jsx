import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createTask } from "../../services/taskService";
import { getClients } from "../../services/clientService";
import api from "../../services/api";
import "./Tasks.css";

function AddTask() {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [orders, setOrders] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    client: "",
    order: "",
    priority: "medium",
    status: "todo",
    dueDate: "",
  });

  useEffect(() => {
    const loadFormData = async () => {
      try {
        setLoadingData(true);
        const [usersResponse, clientsResponse, ordersResponse] = await Promise.all([
          api.get("/users"),
          getClients(),
          api.get("/orders"),
        ]);

        setUsers(usersResponse.data.users || []);
        setClients(clientsResponse.clients || []);
        setOrders(ordersResponse.data.orders || []);
      } catch (error) {
        console.error("Load task form data error:", error);

        toast.error(error.response?.data?.message || "Failed to load task form data");
      } finally {
        setLoadingData(false);
      }
    };

    loadFormData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please enter task title");
      return;
    }

    if (!formData.assignedTo) {
      toast.error("Please select a user");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        title: formData.title.trim(),
        assignedTo: formData.assignedTo,
        priority: formData.priority,
        status: formData.status,
      };

      if (formData.description.trim()) {
        payload.description = formData.description.trim();
      }

      if (formData.client) {
        payload.client = formData.client;
      }

      if (formData.order) {
        payload.order = formData.order;
      }

      if (formData.dueDate) {
        payload.dueDate = formData.dueDate;
      }

      await createTask(payload);
      toast.success("Task created successfully");

      setTimeout(() => {
        navigate("/tasks");
      }, 800);
    } catch (error) {
      console.error("Create task error:", error);

      toast.error(error.response?.data?.message || "Failed to create task");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <div>
          <h1>Add Task</h1>
          <p>Create and assign a new task to your team.</p>
        </div>

        <button type="button" className="task-back-button" onClick={() => navigate("/tasks")} disabled={saving}>
          Back
        </button>
      </div>

      <div className="task-form-card">
        {loadingData ? (
          <div className="tasks-empty">
            <p>Loading task form...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="task-form-grid">
              <div className="task-form-group">
                <label>Title <span>*</span></label>

                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Enter task title" required />
              </div>

              <div className="task-form-group">
                <label>Assigned To <span>*</span></label>

                <select name="assignedTo" value={formData.assignedTo} onChange={handleChange} required>
                  <option value="">Select user</option>

                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name}{user.role ? ` (${user.role})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="task-form-group">
                <label>Client</label>

                <select name="client" value={formData.client} onChange={handleChange}>
                  <option value="">Select client</option>

                  {clients.map((client) => (
                    <option key={client._id} value={client._id}>
                      {client.companyName || client.contactPerson || "Client"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="task-form-group">
                <label>Order</label>

                <select name="order" value={formData.order} onChange={handleChange}>
                  <option value="">Select order</option>

                  {orders.map((order) => (
                    <option key={order._id} value={order._id}>
                      {order.packageName || order.packageType || "Order"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="task-form-group">
                <label>Priority</label>

                <select name="priority" value={formData.priority} onChange={handleChange}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div className="task-form-group">
                <label>Status</label>

                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="task-form-group">
                <label>Due Date</label>

                <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} />
              </div>

              <div className="task-form-group task-form-full">
                <label>Description</label>

                <textarea name="description" value={formData.description} onChange={handleChange} rows="5" placeholder="Enter task description..." />
              </div>
            </div>

            <div className="task-form-actions">
              <button type="submit" className="task-save-button" disabled={saving}>
                <Save size={18} />
                {saving ? "Creating..." : "Create Task"}
              </button>
            </div>
          </form>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
    </div>
  );
}

export default AddTask;