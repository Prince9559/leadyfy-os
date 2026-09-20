const express = require("express");

const {
  createVideo,
  getVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  clientReviewVideo,
} = require("../controllers/videoController");

const protect = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Create Video
router.post(
  "/",
  protect,
  authorizeRoles("owner", "admin"),
  createVideo
);

// Get All Videos
router.get(
  "/",
  protect,
  authorizeRoles("owner", "admin", "employee"),
  getVideos
);

// Client Approve / Revision
router.patch(
  "/:id/client-review",
  protect,
  authorizeRoles("client"),
  clientReviewVideo
);

// Get Single Video
router.get(
  "/:id",
  protect,
  authorizeRoles("owner", "admin", "employee"),
  getVideoById
);

// Update Video
router.put(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  updateVideo
);

// Delete Video
router.delete(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  deleteVideo
);

module.exports = router;