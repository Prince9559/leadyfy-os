const express = require("express");

const {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
} = require("../controllers/clientController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Create Client
router.post(
  "/",
  protect,
  authorizeRoles("owner", "admin"),
  createClient
);

// Get Clients
// Client ko bhi access milega
router.get(
  "/",
  protect,
  authorizeRoles("owner", "admin", "employee", "client"),
  getClients
);

// Get Single Client
// Client ko bhi access milega
router.get(
  "/:id",
  protect,
  authorizeRoles("owner", "admin", "employee", "client"),
  getClientById
);

// Update Client
router.put(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  updateClient
);

// Delete Client
router.delete(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  deleteClient
);

module.exports = router;