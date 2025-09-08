const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  joinClass,
  getEnrolledClasses,
  leaveClass,
  getStudentClassDetails,
} = require("../controllers/studentController");

// Student-specific routes
router.post("/join", protect, joinClass);
router.get("/enrolled", protect, getEnrolledClasses);
router.delete("/leave/:classId", protect, leaveClass);
router.get("/details/:classId", protect, getStudentClassDetails);

module.exports = router;