const express = require("express");

const {
  createScript,
  getScripts,
  getScriptById,
  updateScript,
  deleteScript,
} = require("../controllers/scriptController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Create Script
router.post(
  "/",
  protect,
  authorizeRoles("owner", "admin"),
  createScript
);

// Get All Scripts
router.get(
  "/",
  protect,
  authorizeRoles("owner", "admin", "employee"),
  getScripts
);

// Get Single Script
router.get(
  "/:id",
  protect,
  authorizeRoles("owner", "admin", "employee"),
  getScriptById
);

// Update Script
router.put(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  updateScript
);

// Delete Script
router.delete(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  deleteScript
);

module.exports = router;