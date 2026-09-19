const express = require("express");

const {
  createCreator,
  getCreators,
  getCreatorById,
  updateCreator,
  deleteCreator,
} = require("../controllers/creatorController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Create Creator
router.post(
  "/",
  protect,
  authorizeRoles("owner", "admin"),
  createCreator
);

// Get All Creators
router.get(
  "/",
  protect,
  authorizeRoles("owner", "admin", "employee"),
  getCreators
);

// Get Single Creator
router.get(
  "/:id",
  protect,
  authorizeRoles("owner", "admin", "employee"),
  getCreatorById
);

// Update Creator
router.put(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  updateCreator
);

// Delete Creator
router.delete(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  deleteCreator
);

module.exports = router;