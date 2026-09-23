import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  getTasks,
  deleteTask,
} from "../../services/taskService";

import "./Tasks.css";

function TaskList() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    try {
      setLoading(true);

      const data = await getTasks();

      setTasks(data.tasks || []);
    } catch (error) {
      console.error("Get tasks error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load tasks"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

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

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getPriorityClass = (priority) => {
    return `task-priority task-priority-${priority}`;
  };

  const getStatusClass = (status) => {
    return `task-status task-status-${status}`;
  };

  const handleDelete = (task) => {
    toast(
      ({ closeToast }) => (
        <div className="task-delete-confirm">
          <p>
            Delete <strong>
                Are you sure you want to delete this task?
                </strong>?
          </p>

          <div className="task-confirm-actions">
            <button
              type="button"
              className="task-confirm-delete"
              onClick={async () => {
                try {
                  await deleteTask(task._id);

                  setTasks((prev) =>
                    prev.filter(
                      (item) =>
                        item._id !== task._id
                    )
                  );

                  toast.success(
                    "Task deleted successfully"
                  );
                } catch (error) {
                  console.error(
                    "Delete task error:",
                    error
                  );

                  toast.error(
                    error.response?.data?.message ||
                      "Failed to delete task"
                  );
                }

                closeToast();
              }}
            >
              Delete
            </button>

            <button
              type="button"
              className="task-confirm-cancel"
              onClick={closeToast}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeButton: false,
        position: "top-right",
      }
    );
  };

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <div>
          <h1>Tasks</h1>

          <p>
            Manage and track tasks assigned to your team.
          </p>
        </div>

        <button
          type="button"
          className="add-task-button"
          onClick={() => navigate("/tasks/add")}
        >
          <Plus size={18} />
          Add Task
        </button>
      </div>

      {loading ? (
        <div className="tasks-empty">
          <p>Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="tasks-empty">
          <p>No tasks found.</p>

          <button
            type="button"
            onClick={() =>
              navigate("/tasks/add")
            }
          >
            Create your first task
          </button>
        </div>
      ) : (
        <>
          {/* Desktop / Tablet Table */}
          <div className="tasks-table-card">
            <div className="tasks-table-wrapper">
              <table className="tasks-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Assigned To</th>
                    <th>Client</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Due Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {tasks.map((task) => (
                    <tr key={task._id}>
                      <td className="task-title-cell">
                        {task.title}
                      </td>

                      <td>
                        {task.assignedTo?.name ||
                          "-"}
                      </td>

                      <td>
                        {task.client?.companyName ||
                          "-"}
                      </td>

                      <td>
                        <span
                          className={getPriorityClass(
                            task.priority
                          )}
                        >
                          {formatPriority(
                            task.priority
                          )}
                        </span>
                      </td>

                      <td>
                        <span
                          className={getStatusClass(
                            task.status
                          )}
                        >
                          {formatStatus(
                            task.status
                          )}
                        </span>
                      </td>

                      <td>
                        {formatDate(task.dueDate)}
                      </td>

                      <td>
                        <div className="task-actions">
                          <button
                            type="button"
                            className="task-action-view"
                            title="View"
                            onClick={() =>
                              navigate(
                                `/tasks/view/${task._id}`
                              )
                            }
                          >
                            <Eye size={17} />
                          </button>

                          <button
                            type="button"
                            className="task-action-edit"
                            title="Edit"
                            onClick={() =>
                              navigate(
                                `/tasks/${task._id}`
                              )
                            }
                          >
                            <Edit size={17} />
                          </button>

                          <button
                            type="button"
                            className="task-action-delete"
                            title="Delete"
                            onClick={() =>
                              handleDelete(task)
                            }
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="tasks-mobile-list">
            {tasks.map((task) => (
              <div
                className="task-mobile-card"
                key={task._id}
              >
                <div className="task-mobile-top">
                  <div>
                    <h3>{task.title}</h3>

                    <p>
                      {task.assignedTo?.name ||
                        "Unassigned"}
                    </p>
                  </div>

                  <span
                    className={getPriorityClass(
                      task.priority
                    )}
                  >
                    {formatPriority(
                      task.priority
                    )}
                  </span>
                </div>

                <div className="task-mobile-details">
                  <div>
                    <span>Client</span>
                    <strong>
                      {task.client?.companyName ||
                        "-"}
                    </strong>
                  </div>

                  <div>
                    <span>Status</span>

                    <span
                      className={getStatusClass(
                        task.status
                      )}
                    >
                      {formatStatus(
                        task.status
                      )}
                    </span>
                  </div>

                  <div>
                    <span>Due Date</span>

                    <strong>
                      {formatDate(task.dueDate)}
                    </strong>
                  </div>
                </div>

                <div className="task-mobile-actions">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/tasks/view/${task._id}`
                      )
                    }
                  >
                    <Eye size={16} />
                    View
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/tasks/${task._id}`
                      )
                    }
                  >
                    <Edit size={16} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(task)
                    }
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
}

export default TaskList;