const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");
const {
  getDashboardStats,
  getAllStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent,
  getAllTeachers,
  getTeacherById,
  addTeacher,
  updateTeacher,
  deleteTeacher,
  getPendingAdmins,
  approveAdmin,
  rejectAdmin,
  getAllAdmins,
} = require("../controllers/adminController");

// All routes require admin authentication
router.use(protect, adminOnly);

// Dashboard
router.get("/dashboard", getDashboardStats);

// Student Management
router.get("/students", getAllStudents);
router.get("/students/:id", getStudentById);
router.post("/students", addStudent);
router.put("/students/:id", updateStudent);
router.delete("/students/:id", deleteStudent);

// Teacher Management
router.get("/teachers", getAllTeachers);
router.get("/teachers/:id", getTeacherById);
router.post("/teachers", addTeacher);
router.put("/teachers/:id", updateTeacher);
router.delete("/teachers/:id", deleteTeacher);

// Admin Approval
router.get("/pending-admins", getPendingAdmins);
router.put("/approve/:id", approveAdmin);
router.put("/reject/:id", rejectAdmin);
router.get("/admins", getAllAdmins);

module.exports = router;
