const express = require("express");
const {createOrder,getOrders,getOrderById,updateOrder,deleteOrder,} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("owner", "admin"),
  createOrder
);

router.get(
  "/",
  protect,
  authorizeRoles("owner", "admin", "employee"),
  getOrders
);

router.get(
  "/:id",
  protect,
  authorizeRoles("owner", "admin", "employee"),
  getOrderById
);

router.put(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  updateOrder
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  deleteOrder
);

module.exports = router;