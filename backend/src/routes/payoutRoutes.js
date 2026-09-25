const express = require("express");
const {createCreatorPayout,getCreatorPayouts,getCreatorPayoutById,updateCreatorPayout,deleteCreatorPayout,} = require("../controllers/creatorPayoutController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("owner", "admin"),
  createCreatorPayout
);

router.get(
  "/",
  protect,
  authorizeRoles("owner", "admin", "employee"),
  getCreatorPayouts
);

router.get(
  "/:id",
  protect,
  authorizeRoles("owner", "admin", "employee"),
  getCreatorPayoutById
);

router.put(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  updateCreatorPayout
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  deleteCreatorPayout
);

module.exports = router;