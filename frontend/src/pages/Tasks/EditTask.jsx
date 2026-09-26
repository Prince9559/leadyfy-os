import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getTaskById, updateTask } from "../../services/taskService";
import { getClients } from "../../services/clientService";
import api from "../../services/api";

import "./Tasks.css";

function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    const loadData = async () => {
      try {
        setLoading(true);

        const [taskResponse, usersResponse, clientsResponse, ordersResponse] = await Promise.all([
          getTaskById(id),
          api.get("/users"),
          getClients(),
          api.get("/orders"),
        ]);

        const task = taskResponse.task;

        if (!task) {
          toast.error("Task not found");
          return;
        }

        setUsers(usersResponse.data.users || []);
        setClients(clientsResponse.clients || []);
        setOrders(ordersResponse.data.orders || []);

        setFormData({
          title: task.title || "",
          description: task.description || "",
          assignedTo: task.assignedTo?._id || "",
          client: task.client?._id || "",
          order: task.order?._id || "",
          priority: task.priority || "medium",
          status: task.status || "todo",
          dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
        });
      } catch (error) {
        console.error("Load edit task error:", error);

        toast.error(error.response?.data?.message || "Failed to load task");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

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
        description: formData.description.trim(),
        assignedTo: formData.assignedTo,
        client: formData.client || "",
        order: formData.order || "",
        priority: formData.priority,
        status: formData.status,
        dueDate: formData.dueDate || "",
      };

      await updateTask(id, payload);
      toast.success("Task updated successfully");

      setTimeout(() => {
        navigate(`/tasks/view/${id}`);
      }, 800);
    } catch (error) {
      console.error("Update task error:", error);

      toast.error(error.response?.data?.message || "Failed to update task");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="tasks-page">
        <div className="tasks-empty">
          <p>Loading task...</p>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    );
  }

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <div>
          <h1>Edit Task</h1>
          <p>Update task details and assignment.</p>
        </div>

        <button type="button" className="task-back-button" onClick={() => navigate(`/tasks/view/${id}`)} disabled={saving}>
          Back
        </button>
      </div>

      <div className="task-form-card">
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
              {saving ? "Updating..." : "Update Task"}
            </button>
          </div>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
    </div>
  );
}

export default EditTask;