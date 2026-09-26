import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Edit } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getTaskById } from "../../services/taskService";
import "./Tasks.css";

function TaskView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTask = async () => {
      try {
        const data = await getTaskById(id);

        setTask(data.task);
      } catch (error) {
        console.error("Get task error:", error);

        toast.error(error.response?.data?.message || "Failed to load task");
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [id]);

  const formatPriority = (priority) => {
    const priorities = {
      low: "Low",
      medium: "Medium",
      high: "High",
      urgent: "Urgent",
    };

    return priorities[priority] || priority || "-";
  };

  const formatStatus = (status) => {
    const statuses = {
      todo: "To Do",
      in_progress: "In Progress",
      completed: "Completed",
      cancelled: "Cancelled",
    };

    return statuses[status] || status || "-";
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
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

  if (!task) {
    return (
      <div className="tasks-page">
        <div className="tasks-header">
          <div>
            <h1>Task Details</h1>

            <p>Task information could not be found.</p>
          </div>

          <button type="button" className="task-back-button" onClick={() => navigate("/tasks")}>
            Back
          </button>
        </div>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    );
  }

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <div>
          <h1>Task Details</h1>

          <p>View complete information about this task.</p>
        </div>

        <button type="button" className="task-back-button" onClick={() => navigate("/tasks")}>
          Back
        </button>
      </div>

      <div className="task-view-card">
        <div className="task-view-grid">
          <div className="task-view-item">
            <span className="task-view-label">Title</span>

            <strong>{task.title || "-"}</strong>
          </div>

          <div className="task-view-item">
            <span className="task-view-label">Assigned To</span>

            <strong>{task.assignedTo?.name || "-"}</strong>

            {task.assignedTo?.email && <small>{task.assignedTo.email}</small>}
          </div>

          <div className="task-view-item">
            <span className="task-view-label">Client</span>

            <strong>{task.client?.companyName || task.client?.contactPerson || "-"}</strong>

            {task.client?.email && <small>{task.client.email}</small>}
          </div>

          <div className="task-view-item">
            <span className="task-view-label">Order</span>

            <strong>{task.order?.packageName || task.order?.packageType || "-"}</strong>
          </div>

          <div className="task-view-item">
            <span className="task-view-label">Priority</span>

            <span className={`task-view-priority task-priority-${task.priority}`}>
              {formatPriority(task.priority)}
            </span>
          </div>

          <div className="task-view-item">
            <span className="task-view-label">Status</span>

            <span className={`task-view-status task-status-${task.status}`}>
              {formatStatus(task.status)}
            </span>
          </div>

          <div className="task-view-item">
            <span className="task-view-label">Due Date</span>

            <strong>{formatDate(task.dueDate)}</strong>
          </div>

          <div className="task-view-item">
            <span className="task-view-label">Created By</span>

            <strong>{task.createdBy?.name || "-"}</strong>

            {task.createdBy?.email && <small>{task.createdBy.email}</small>}
          </div>

          <div className="task-view-item task-view-full">
            <span className="task-view-label">Description</span>

            <div className="task-view-text">{task.description || "No description added."}</div>
          </div>
        </div>

        <div className="task-view-actions">
          <button type="button" className="task-edit-button" onClick={() => navigate(`/tasks/${task._id}`)}>
            <Edit size={18} />
            Edit Task
          </button>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
    </div>
  );
}

export default TaskView;