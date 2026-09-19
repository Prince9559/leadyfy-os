const express = require("express");

const {
  createShoot,
  getShoots,
  getShootById,
  updateShoot,
  deleteShoot,
} = require("../controllers/shootController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Parse JSON request body
router.use(express.json());

// TEST BODY
router.post("/test-body", (req, res) => {
  console.log("TEST BODY:", req.body);

  res.json({
    success: true,
    body: req.body,
  });
});

// Create Shoot
router.post(
  "/",
  protect,
  authorizeRoles("owner", "admin"),
  createShoot
);

// Get All Shoots
router.get(
  "/",
  protect,
  authorizeRoles("owner", "admin", "employee"),
  getShoots
);

// Get Single Shoot
router.get(
  "/:id",
  protect,
  authorizeRoles("owner", "admin", "employee"),
  getShootById
);

// Update Shoot
router.put(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  updateShoot
);

// Delete Shoot
router.delete(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  deleteShoot
);

module.exports = router;