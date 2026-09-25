const express = require("express");
const {createTask,getTasks,getTaskById,updateTask,deleteTask,} = require("../controllers/taskController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("owner", "admin"),
  createTask
);
router.get(
  "/",
  protect,
  authorizeRoles("owner", "admin", "employee"),
  getTasks
);

router.get(
  "/:id",
  protect,
  authorizeRoles("owner", "admin", "employee"),
  getTaskById
);

router.put(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  updateTask
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  deleteTask
);

module.exports = router;