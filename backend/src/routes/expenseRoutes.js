const express = require("express");

const {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Create Expense
router.post(
  "/",
  protect,
  authorizeRoles("owner", "admin"),
  createExpense
);

// Get All Expenses
router.get(
  "/",
  protect,
  authorizeRoles("owner", "admin", "employee"),
  getExpenses
);

// Get Single Expense
router.get(
  "/:id",
  protect,
  authorizeRoles("owner", "admin", "employee"),
  getExpenseById
);

// Update Expense
router.put(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  updateExpense
);

// Delete Expense
router.delete(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  deleteExpense
);

module.exports = router;