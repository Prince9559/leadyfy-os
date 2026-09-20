const express = require("express");

const {
  getUsers,
  getUserById,
  updateUser,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  authorizeRoles("owner", "admin"),
  getUsers
);

router.get(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  getUserById
);

router.put(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  updateUser
);

module.exports = router;