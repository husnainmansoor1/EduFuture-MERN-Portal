const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { profileUpload } = require("../middleware/uploadMiddleware");
const { register, login, updateProfile, deleteProfileImage } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);

// Update Profile
router.put(
  "/profile",
  protect,
  profileUpload.single("image"),
  updateProfile
);

// Delete Profile Image
router.delete("/profile/image", protect, deleteProfileImage);

module.exports = router;
