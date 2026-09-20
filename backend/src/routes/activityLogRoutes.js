const express = require("express");

const {
  createActivityLog,
  getActivityLogs,
  getActivityLogById,
  deleteActivityLog,
} = require("../controllers/activityLogController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("owner", "admin"),
  createActivityLog
);

router.get(
  "/",
  protect,
  authorizeRoles("owner", "admin"),
  getActivityLogs
);

router.get(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  getActivityLogById
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  deleteActivityLog
);

module.exports = router;