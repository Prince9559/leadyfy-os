const express = require("express");
const {createScript,getScripts,getScriptById,updateScript,deleteScript,} = require("../controllers/scriptController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("owner", "admin"),
  createScript
);

router.get(
  "/",
  protect,
  authorizeRoles("owner", "admin", "employee"),
  getScripts
);
router.get(
  "/:id",
  protect,
  authorizeRoles("owner", "admin", "employee"),
  getScriptById
);

router.put(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  updateScript
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  deleteScript
);

module.exports = router;