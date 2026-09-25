const express = require("express");
const {createClient,getClients,getClientById,updateClient,deleteClient,} = require("../controllers/clientController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();
router.post(
  "/",
  protect,
  authorizeRoles("owner", "admin"),
  createClient
);

router.get(
  "/",
  protect,
  authorizeRoles("owner", "admin", "employee", "client"),
  getClients
);

router.get(
  "/:id",
  protect,
  authorizeRoles("owner", "admin", "employee", "client"),
  getClientById
);

router.put(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  updateClient
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  deleteClient
);

module.exports = router;