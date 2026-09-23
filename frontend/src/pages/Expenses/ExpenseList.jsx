import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  getExpenses,
  deleteExpense,
} from "../../services/expenseService";

import "./Expenses.css";

function ExpenseList() {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);

      const data = await getExpenses();

      setExpenses(data.expenses || []);
    } catch (error) {
      console.error("Get expenses error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load expenses"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCategory = (category) => {
    const categories = {
      creator: "Creator",
      production: "Production",
      software: "Software",
      marketing: "Marketing",
      office: "Office",
      travel: "Travel",
      other: "Other",
    };

    return categories[category] || category || "-";
  };

  const formatPaymentMethod = (method) => {
    const methods = {
      cash: "Cash",
      bank_transfer: "Bank Transfer",
      upi: "UPI",
      card: "Card",
      other: "Other",
    };

    return methods[method] || method || "-";
  };

  const formatStatus = (status) => {
    const statuses = {
      pending: "Pending",
      paid: "Paid",
      cancelled: "Cancelled",
    };

    return statuses[status] || status || "-";
  };

  const handleDelete = (id) => {
    toast.info(
      <div className="expense-delete-confirm">
        <p>Are you sure you want to delete this expense?</p>

        <div className="expense-confirm-actions">
          <button
            type="button"
            className="expense-confirm-delete"
            onClick={async () => {
              try {
                await deleteExpense(id);

                setExpenses((prev) =>
                  prev.filter((expense) => expense._id !== id)
                );

                toast.dismiss();
                toast.success(
                  "Expense deleted successfully"
                );
              } catch (error) {
                console.error(
                  "Delete expense error:",
                  error
                );

                toast.dismiss();

                toast.error(
                  error.response?.data?.message ||
                    "Failed to delete expense"
                );
              }
            }}
          >
            Delete
          </button>

          <button
            type="button"
            className="expense-confirm-cancel"
            onClick={() => toast.dismiss()}
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeButton: false,
        closeOnClick: false,
      }
    );
  };

  return (
    <div className="expenses-page">
      <div className="expenses-header">
        <div>
          <h1>Expenses</h1>

          <p>
            Manage and track all business expenses.
          </p>
        </div>

        <button
          type="button"
          className="add-expense-button"
          onClick={() => navigate("/expenses/add")}
        >
          <Plus size={18} />
          Add Expense
        </button>
      </div>

      {loading ? (
        <div className="expenses-empty">
          <p>Loading expenses...</p>
        </div>
      ) : expenses.length === 0 ? (
        <div className="expenses-empty">
          <p>No expenses found.</p>

          <button
            type="button"
            onClick={() => navigate("/expenses/add")}
          >
            Add your first expense
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="expenses-table-card">
            <div className="expenses-table-wrapper">
              <table className="expenses-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Payment Method</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense._id}>
                      <td>
                        <div className="expense-title-cell">
                          <strong>
                            {expense.title}
                          </strong>

                          {expense.description && (
                            <span>
                              {expense.description}
                            </span>
                          )}
                        </div>
                      </td>

                      <td>
                        {formatCategory(expense.category)}
                      </td>

                      <td>
                        <strong>
                          {formatAmount(expense.amount)}
                        </strong>
                      </td>

                      <td>
                        {formatPaymentMethod(
                          expense.paymentMethod
                        )}
                      </td>

                      <td>
                        {formatDate(expense.expenseDate)}
                      </td>

                      <td>
                        <span
                          className={`expense-status expense-status-${expense.status}`}
                        >
                          {formatStatus(expense.status)}
                        </span>
                      </td>

                      <td>
                        <div className="expense-actions">
                          <button
                            type="button"
                            title="View"
                            onClick={() =>
                              navigate(
                                `/expenses/view/${expense._id}`
                              )
                            }
                          >
                            <Eye size={17} />
                          </button>

                          <button
                            type="button"
                            title="Edit"
                            onClick={() =>
                              navigate(
                                `/expenses/${expense._id}`
                              )
                            }
                          >
                            <Edit size={17} />
                          </button>

                          <button
                            type="button"
                            title="Delete"
                            className="expense-delete-action"
                            onClick={() =>
                              handleDelete(expense._id)
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
          <div className="expenses-mobile-list">
            {expenses.map((expense) => (
              <div
                className="expense-mobile-card"
                key={expense._id}
              >
                <div className="expense-mobile-top">
                  <div>
                    <h3>{expense.title}</h3>

                    <p>
                      {formatCategory(expense.category)}
                    </p>
                  </div>

                  <strong>
                    {formatAmount(expense.amount)}
                  </strong>
                </div>

                <div className="expense-mobile-details">
                  <div>
                    <span>Payment Method</span>
                    <strong>
                      {formatPaymentMethod(
                        expense.paymentMethod
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Date</span>
                    <strong>
                      {formatDate(expense.expenseDate)}
                    </strong>
                  </div>

                  <div>
                    <span>Status</span>

                    <span
                      className={`expense-status expense-status-${expense.status}`}
                    >
                      {formatStatus(expense.status)}
                    </span>
                  </div>
                </div>

                <div className="expense-mobile-actions">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/expenses/view/${expense._id}`
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
                        `/expenses/${expense._id}`
                      )
                    }
                  >
                    <Edit size={16} />
                    Edit
                  </button>

                  <button
                    type="button"
                    className="expense-mobile-delete"
                    onClick={() =>
                      handleDelete(expense._id)
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

export default ExpenseList;