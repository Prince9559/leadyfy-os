const express = require("express");
const {createUser,getUsers,getUserById,updateUser,deleteUser,} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();
router.post(
  "/",
  protect,
  authorizeRoles("owner", "admin"),
  createUser
);

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

router.delete(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  deleteUser
);

module.exports = router;