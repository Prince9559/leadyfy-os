const express = require("express");

const {
  createCreatorPayout,
  getCreatorPayouts,
  getCreatorPayoutById,
  updateCreatorPayout,
  deleteCreatorPayout,
} = require("../controllers/creatorPayoutController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Create payout
router.post(
  "/",
  protect,
  authorizeRoles("owner", "admin"),
  createCreatorPayout
);

// Get all payouts
router.get(
  "/",
  protect,
  authorizeRoles("owner", "admin", "employee"),
  getCreatorPayouts
);

// Get single payout
router.get(
  "/:id",
  protect,
  authorizeRoles("owner", "admin", "employee"),
  getCreatorPayoutById
);

// Update payout
router.put(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  updateCreatorPayout
);

// Delete payout
router.delete(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  deleteCreatorPayout
);

module.exports = router;