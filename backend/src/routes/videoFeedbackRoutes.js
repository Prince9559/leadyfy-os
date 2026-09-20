const express = require("express");

const {
  createFeedback,
  getFeedbacks,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
} = require("../controllers/videoFeedbackController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Create Feedback
router.post(
  "/",
  protect,
  authorizeRoles("owner", "admin", "client"),
  createFeedback
);

// Get All Feedback
router.get(
  "/",
  protect,
  authorizeRoles("owner", "admin", "employee", "client"),
  getFeedbacks
);

// Get Single Feedback
router.get(
  "/:id",
  protect,
  authorizeRoles("owner", "admin", "employee", "client"),
  getFeedbackById
);

// Update Feedback
router.put(
  "/:id",
  protect,
  authorizeRoles("owner", "admin", "client"),
  updateFeedback
);

// Delete Feedback
router.delete(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  deleteFeedback
);

module.exports = router;