const express = require("express");
const {createFeedback,getFeedbacks,getFeedbackById,updateFeedback,deleteFeedback,} = require("../controllers/videoFeedbackController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("owner", "admin", "client"),
  createFeedback
);

router.get(
  "/",
  protect,
  authorizeRoles("owner", "admin", "employee", "client"),
  getFeedbacks
);

router.get(
  "/:id",
  protect,
  authorizeRoles("owner", "admin", "employee", "client"),
  getFeedbackById
);

router.put(
  "/:id",
  protect,
  authorizeRoles("owner", "admin", "client"),
  updateFeedback
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  deleteFeedback
);

module.exports = router;