const express = require("express");

const {createPayment,getPayments,getPaymentById,updatePayment,deletePayment,} = require("../controllers/paymentController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("owner", "admin"),
  createPayment
);

router.get(
  "/",
  protect,
  authorizeRoles("owner", "admin", "employee"),
  getPayments
);

router.get(
  "/:id",
  protect,
  authorizeRoles("owner", "admin", "employee"),
  getPaymentById
);

router.put(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  updatePayment
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  deletePayment
);

module.exports = router;