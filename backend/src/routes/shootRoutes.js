const express = require("express");
const {createShoot,getShoots,getShootById,updateShoot,deleteShoot,} = require("../controllers/shootController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const router = express.Router();

router.use(express.json());
router.post("/test-body", (req, res) => {
  console.log("TEST BODY:", req.body);
  res.json({
    success: true,
    body: req.body,
  });
});

router.post(
  "/",
  protect,
  authorizeRoles("owner", "admin"),
  createShoot
);

router.get(
  "/",
  protect,
  authorizeRoles("owner", "admin", "employee"),
  getShoots
);

router.get(
  "/:id",
  protect,
  authorizeRoles("owner", "admin", "employee"),
  getShootById
);

router.put(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  updateShoot
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("owner", "admin"),
  deleteShoot
);

module.exports = router;