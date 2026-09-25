const express = require("express");
const {createSupportTicket,getSupportTickets,getSupportTicketById,updateSupportTicket,deleteSupportTicket,} = require("../controllers/supportController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();
router.post(
  "/",
  protect,
  authorizeRoles("owner", "admin", "client"),
  createSupportTicket
);

router.get(
  "/",
  protect,
  authorizeRoles("owner", "admin", "employee", "client"),
  getSupportTickets
);

router.get(
  "/:id",
  protect,
  authorizeRoles("owner", "admin", "employee", "client"),
  getSupportTicketById
);

router.put(
  "/:id",
  protect,
  authorizeRoles("owner", "admin", "client"),
  updateSupportTicket
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  deleteSupportTicket
);

module.exports = router;