const express = require("express");
const {getDashboardStats,} = require("../controllers/dashboardController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/stats",
  protect,
  authorizeRoles("owner", "admin", "employee"),
  getDashboardStats
);

module.exports = router;