const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");


router.post("/register", register);

router.post("/login", login);

// Update Profile
router.put(
  "/profile",
  require("../middleware/authMiddleware").protect,
  require("../middleware/uploadMiddleware").single("image"),
  require("../controllers/authController").updateProfile
);

module.exports = router;
