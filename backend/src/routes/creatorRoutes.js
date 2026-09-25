const express = require("express");
const {createCreator,getCreators,getCreatorById,updateCreator,deleteCreator,} = require("../controllers/creatorController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();
router.post(
  "/",
  protect,
  authorizeRoles("owner", "admin"),
  createCreator
);

router.get(
  "/",
  protect,
  authorizeRoles("owner", "admin", "employee"),
  getCreators
);

router.get(
  "/:id",
  protect,
  authorizeRoles("owner", "admin", "employee"),
  getCreatorById
);

router.put(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  updateCreator
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  deleteCreator
);

module.exports = router;