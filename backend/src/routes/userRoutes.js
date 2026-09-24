const express = require("express");

const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Create new user
router.post(
  "/",
  protect,
  authorizeRoles("owner", "admin"),
  createUser
);

// Get all users
router.get(
  "/",
  protect,
  authorizeRoles("owner", "admin"),
  getUsers
);

// Get single user
router.get(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  getUserById
);

// Update user
router.put(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  updateUser
);

// Delete user

router.delete(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  deleteUser
);

module.exports = router;