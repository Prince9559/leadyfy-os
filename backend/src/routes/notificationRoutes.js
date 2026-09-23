const express = require("express");

const {
  createNotification,
  getNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification,
  markNotificationAsRead,
} = require("../controllers/notificationController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("owner", "admin"),
  createNotification
);

router.get(
  "/",
  protect,
  authorizeRoles("owner", "admin", "employee", "client"),
  getNotifications
);

router.get(
  "/:id",
  protect,
  authorizeRoles("owner", "admin", "employee", "client"),
  getNotificationById
);

router.put(
  "/:id/read",
  protect,
  authorizeRoles("owner", "admin", "employee", "client"),
  markNotificationAsRead
);

router.put(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  updateNotification
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  deleteNotification
);

module.exports = router;