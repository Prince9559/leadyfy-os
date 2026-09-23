import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save } from "lucide-react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  getExpenseById,
  updateExpense,
} from "../../services/expenseService";

import "./Expenses.css";

function EditExpense() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "other",
    amount: "",
    expenseDate: "",
    paymentMethod: "bank_transfer",
    status: "paid",
    notes: "",
  });

  useEffect(() => {
    const loadExpense = async () => {
      try {
        const data = await getExpenseById(id);
        const expense = data.expense;

        if (!expense) {
          toast.error("Expense not found");
          navigate("/expenses");
          return;
        }

        setFormData({
          title: expense.title || "",
          description: expense.description || "",
          category: expense.category || "other",
          amount:
            expense.amount !== undefined
              ? expense.amount
              : "",
          expenseDate: expense.expenseDate
            ? new Date(expense.expenseDate)
                .toISOString()
                .split("T")[0]
            : "",
          paymentMethod:
            expense.paymentMethod || "bank_transfer",
          status: expense.status || "paid",
          notes: expense.notes || "",
        });
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
  }, [id, navigate]);

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
      toast.error("Please enter expense title");
      return;
    }

    if (
      formData.amount === "" ||
      Number(formData.amount) < 0
    ) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        amount: Number(formData.amount),
        paymentMethod: formData.paymentMethod,
        status: formData.status,
      };

      if (formData.description.trim()) {
        payload.description =
          formData.description.trim();
      } else {
        payload.description = "";
      }

      if (formData.expenseDate) {
        payload.expenseDate = formData.expenseDate;
      }

      if (formData.notes.trim()) {
        payload.notes = formData.notes.trim();
      } else {
        payload.notes = "";
      }

      await updateExpense(id, payload);

      toast.success("Expense updated successfully");

      setTimeout(() => {
        navigate(`/expenses/view/${id}`);
      }, 800);
    } catch (error) {
      console.error("Update expense error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update expense"
      );
    } finally {
      setSaving(false);
    }
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

  return (
    <div className="expenses-page">
      <div className="expenses-header">
        <div>
          <h1>Edit Expense</h1>

          <p>
            Update the information of this expense.
          </p>
        </div>

        <button
          type="button"
          className="expense-back-button"
          onClick={() =>
            navigate(`/expenses/view/${id}`)
          }
          disabled={saving}
        >
          Back
        </button>
      </div>

      <div className="expense-form-card">
        <form onSubmit={handleSubmit}>
          <div className="expense-form-grid">
            <div className="expense-form-group">
              <label>
                Title <span>*</span>
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter expense title"
                required
              />
            </div>

            <div className="expense-form-group">
              <label>
                Amount <span>*</span>
              </label>

              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="Enter amount"
                required
              />
            </div>

            <div className="expense-form-group">
              <label>Category</label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="creator">
                  Creator
                </option>

                <option value="production">
                  Production
                </option>

                <option value="software">
                  Software
                </option>

                <option value="marketing">
                  Marketing
                </option>

                <option value="office">
                  Office
                </option>

                <option value="travel">
                  Travel
                </option>

                <option value="other">
                  Other
                </option>
              </select>
            </div>

            <div className="expense-form-group">
              <label>Payment Method</label>

              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                <option value="bank_transfer">
                  Bank Transfer
                </option>

                <option value="upi">UPI</option>

                <option value="cash">Cash</option>

                <option value="card">Card</option>

                <option value="other">Other</option>
              </select>
            </div>

            <div className="expense-form-group">
              <label>Expense Date</label>

              <input
                type="date"
                name="expenseDate"
                value={formData.expenseDate}
                onChange={handleChange}
              />
            </div>

            <div className="expense-form-group">
              <label>Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="paid">Paid</option>

                <option value="pending">
                  Pending
                </option>

                <option value="cancelled">
                  Cancelled
                </option>
              </select>
            </div>

            <div className="expense-form-group expense-form-full">
              <label>Description</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Enter expense description..."
              />
            </div>

            <div className="expense-form-group expense-form-full">
              <label>Notes</label>

              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                placeholder="Enter expense notes..."
              />
            </div>
          </div>

          <div className="expense-form-actions">
            <button
              type="submit"
              className="expense-save-button"
              disabled={saving}
            >
              <Save size={18} />

              {saving
                ? "Updating..."
                : "Update Expense"}
            </button>
          </div>
        </form>
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

export default EditExpense;