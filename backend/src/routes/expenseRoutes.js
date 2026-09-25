const express = require("express");
const {createExpense,getExpenses,getExpenseById,updateExpense,deleteExpense,} = require("../controllers/expenseController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();
router.post(
  "/",
  protect,
  authorizeRoles("owner", "admin"),
  createExpense
);

router.get(
  "/",
  protect,
  authorizeRoles("owner", "admin", "employee"),
  getExpenses
);

router.get(
  "/:id",
  protect,
  authorizeRoles("owner", "admin", "employee"),
  getExpenseById
);

router.put(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  updateExpense
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  deleteExpense
);

module.exports = router;