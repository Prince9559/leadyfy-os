import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save } from "lucide-react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { createExpense } from "../../services/expenseService";

import "./Expenses.css";

function AddExpense() {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "other",
    amount: "",
    expenseDate: new Date().toISOString().split("T")[0],
    paymentMethod: "bank_transfer",
    status: "paid",
    notes: "",
  });

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
      }

      if (formData.expenseDate) {
        payload.expenseDate = formData.expenseDate;
      }

      if (formData.notes.trim()) {
        payload.notes = formData.notes.trim();
      }

      await createExpense(payload);

      toast.success("Expense created successfully");

      setTimeout(() => {
        navigate("/expenses");
      }, 800);
    } catch (error) {
      console.error("Create expense error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to create expense"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="expenses-page">
      <div className="expenses-header">
        <div>
          <h1>Add Expense</h1>

          <p>
            Create and record a new business expense.
          </p>
        </div>

        <button
          type="button"
          className="expense-back-button"
          onClick={() => navigate("/expenses")}
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
                <option value="creator">Creator</option>
                <option value="production">
                  Production
                </option>
                <option value="software">Software</option>
                <option value="marketing">
                  Marketing
                </option>
                <option value="office">Office</option>
                <option value="travel">Travel</option>
                <option value="other">Other</option>
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
                <option value="pending">Pending</option>
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

              {saving ? "Creating..." : "Create Expense"}
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

export default AddExpense;