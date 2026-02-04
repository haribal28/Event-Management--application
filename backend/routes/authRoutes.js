const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Any logged-in user
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Profile accessed successfully",
    user: req.user,
  });
});

// Admin-only route
router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({
      message: "Welcome Admin",
    });
  }
);

// Vendor-only route
router.get(
  "/vendor",
  protect,
  authorizeRoles("vendor"),
  (req, res) => {
    res.json({
      message: "Welcome Vendor",
    });
  }
);

module.exports = router;
