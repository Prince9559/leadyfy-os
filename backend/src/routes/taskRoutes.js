const express = require("express");

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Create Task
router.post(
  "/",
  protect,
  authorizeRoles("owner", "admin"),
  createTask
);

// Get All Tasks
router.get(
  "/",
  protect,
  authorizeRoles("owner", "admin", "employee"),
  getTasks
);

// Get Single Task
router.get(
  "/:id",
  protect,
  authorizeRoles("owner", "admin", "employee"),
  getTaskById
);

// Update Task
router.put(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  updateTask
);

// Delete Task
router.delete(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  deleteTask
);

module.exports = router;