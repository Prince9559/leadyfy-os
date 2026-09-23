import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Edit } from "lucide-react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getExpenseById } from "../../services/expenseService";

import "./Expenses.css";

function ExpenseView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExpense = async () => {
      try {
        const data = await getExpenseById(id);

        setExpense(data.expense);
      } catch (error) {
        console.error("Get expense error:", error);

        toast.error(
          error.response?.data?.message ||
            "Failed to load expense"
        );
      } finally {
        setLoading(false);
      }
    };

    loadExpense();
  }, [id]);

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

  if (loading) {
    return (
      <div className="expenses-page">
        <div className="expenses-empty">
          <p>Loading expense...</p>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
        />
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="expenses-page">
        <div className="expenses-header">
          <div>
            <h1>Expense Details</h1>

            <p>
              Expense information could not be found.
            </p>
          </div>

          <button
            type="button"
            className="expense-back-button"
            onClick={() => navigate("/expenses")}
          >
            Back
          </button>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
        />
      </div>
    );
  }

  return (
    <div className="expenses-page">
      <div className="expenses-header">
        <div>
          <h1>Expense Details</h1>

          <p>
            View complete information about this expense.
          </p>
        </div>

        <button
          type="button"
          className="expense-back-button"
          onClick={() => navigate("/expenses")}
        >
          Back
        </button>
      </div>

      <div className="expense-view-card">
        <div className="expense-view-grid">
          {/* Title */}
          <div className="expense-view-item">
            <span className="expense-view-label">
              Title
            </span>

            <strong>{expense.title || "-"}</strong>
          </div>

          {/* Amount */}
          <div className="expense-view-item">
            <span className="expense-view-label">
              Amount
            </span>

            <strong className="expense-view-amount">
              {formatAmount(expense.amount)}
            </strong>
          </div>

          {/* Category */}
          <div className="expense-view-item">
            <span className="expense-view-label">
              Category
            </span>

            <strong>
              {formatCategory(expense.category)}
            </strong>
          </div>

          {/* Payment Method */}
          <div className="expense-view-item">
            <span className="expense-view-label">
              Payment Method
            </span>

            <strong>
              {formatPaymentMethod(
                expense.paymentMethod
              )}
            </strong>
          </div>

          {/* Expense Date */}
          <div className="expense-view-item">
            <span className="expense-view-label">
              Expense Date
            </span>

            <strong>
              {formatDate(expense.expenseDate)}
            </strong>
          </div>

          {/* Status */}
          <div className="expense-view-item">
            <span className="expense-view-label">
              Status
            </span>

            <span
              className={`expense-view-status expense-status-${expense.status}`}
            >
              {formatStatus(expense.status)}
            </span>
          </div>

          {/* Created By */}
          <div className="expense-view-item">
            <span className="expense-view-label">
              Created By
            </span>

            <strong>
              {expense.createdBy?.name || "-"}
            </strong>

            {expense.createdBy?.email && (
              <small>{expense.createdBy.email}</small>
            )}
          </div>

          {/* Description */}
          <div className="expense-view-item expense-view-full">
            <span className="expense-view-label">
              Description
            </span>

            <div className="expense-view-text">
              {expense.description ||
                "No description added."}
            </div>
          </div>

          {/* Notes */}
          <div className="expense-view-item expense-view-full">
            <span className="expense-view-label">
              Notes
            </span>

            <div className="expense-view-text">
              {expense.notes || "No notes added."}
            </div>
          </div>
        </div>

        <div className="expense-view-actions">
          <button
            type="button"
            className="expense-edit-button"
            onClick={() =>
              navigate(`/expenses/${expense._id}`)
            }
          >
            <Edit size={18} />
            Edit Expense
          </button>
        </div>
      </div>

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

export default ExpenseView;