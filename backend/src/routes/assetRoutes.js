const express = require("express");

const {
  createAsset,
  getAssets,
  getAssetById,
  updateAsset,
  deleteAsset,
} = require("../controllers/assetController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("owner", "admin"),
  createAsset
);

router.get(
  "/",
  protect,
  authorizeRoles("owner", "admin", "employee", "client"),
  getAssets
);

router.get(
  "/:id",
  protect,
  authorizeRoles("owner", "admin", "employee", "client"),
  getAssetById
);

router.put(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  updateAsset
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  deleteAsset
);

module.exports = router;