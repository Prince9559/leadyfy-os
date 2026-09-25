const express = require("express");
const {createVideo,getVideos,getVideoById,updateVideo,deleteVideo,clientReviewVideo,} = require("../controllers/videoController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("owner", "admin"),
  createVideo
);

router.get(
  "/",
  protect,
  authorizeRoles("owner", "admin", "employee"),
  getVideos
);

router.patch(
  "/:id/client-review",
  protect,
  authorizeRoles("client"),
  clientReviewVideo
);

router.get(
  "/:id",
  protect,
  authorizeRoles("owner", "admin", "employee"),
  getVideoById
);

router.put(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  updateVideo
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  deleteVideo
);

module.exports = router;