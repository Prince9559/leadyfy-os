const express = require("express");

const {createAvailability,getAvailabilities,getAvailabilityById,updateAvailability,deleteAvailability,} = require("../controllers/creatorAvailabilityController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();
router.post(
  "/",
  protect,
  authorizeRoles("owner", "admin"),
  createAvailability
);

router.get(
  "/",
  protect,
  authorizeRoles("owner", "admin", "employee"),
  getAvailabilities
);

router.get(
  "/:id",
  protect,
  authorizeRoles("owner", "admin", "employee"),
  getAvailabilityById
);

router.put(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  updateAvailability
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  deleteAvailability
);

module.exports = router;