const express = require("express");

const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("owner", "admin"),
  createEmployee
);

router.get(
  "/",
  protect,
  authorizeRoles("owner", "admin", "employee"),
  getEmployees
);

router.get(
  "/:id",
  protect,
  authorizeRoles("owner", "admin", "employee"),
  getEmployeeById
);

router.put(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  updateEmployee
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  deleteEmployee
);

module.exports = router;