const express = require("express");

const {
  createAvailability,
  getAvailabilities,
  getAvailabilityById,
  updateAvailability,
  deleteAvailability,
} = require("../controllers/creatorAvailabilityController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Create Availability
router.post(
  "/",
  protect,
  authorizeRoles("owner", "admin"),
  createAvailability
);

// Get All Availability
router.get(
  "/",
  protect,
  authorizeRoles("owner", "admin", "employee"),
  getAvailabilities
);

// Get Single Availability
router.get(
  "/:id",
  protect,
  authorizeRoles("owner", "admin", "employee"),
  getAvailabilityById
);

// Update Availability
router.put(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  updateAvailability
);

// Delete Availability
router.delete(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  deleteAvailability
);

module.exports = router;