const express = require("express");
const {registerUser,loginUser,} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/me", protect, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

router.get("/owner-test",
  protect,
  authorizeRoles("owner"),
  (req, res) => {
    res.json({
      success: true,
      message: "Owner access granted",
      user: req.user,
    });
  }
);

module.exports = router;