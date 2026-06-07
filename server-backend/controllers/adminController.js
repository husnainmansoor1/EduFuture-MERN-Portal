const User = require("../models/User");
const Class = require("../models/Class");
const Enrollment = require("../models/Enrollment");
const bcrypt = require("bcryptjs");

// ================= Dashboard Stats ===================
exports.getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalTeachers = await User.countDocuments({ role: "teacher" });
    const totalClasses = await Class.countDocuments();
    const pendingAdmins = await User.countDocuments({
      role: "admin",
      adminStatus: "pending",
    });
    const totalAdmins = await User.countDocuments({
      role: "admin",
      adminStatus: "approved",
    });

    // Recent registrations (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentStudents = await User.countDocuments({
      role: "student",
      createdAt: { $gte: sevenDaysAgo },
    });
    const recentTeachers = await User.countDocuments({
      role: "teacher",
      createdAt: { $gte: sevenDaysAgo },
    });

    // Department distribution
    const departmentStats = await User.aggregate([
      { $match: { role: { $in: ["student", "teacher"] }, department: { $ne: "" } } },
      { $group: { _id: "$department", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Monthly registration trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrend = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
            role: "$role",
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.status(200).json({
      totalStudents,
      totalTeachers,
      totalClasses,
      pendingAdmins,
      totalAdmins,
      recentStudents,
      recentTeachers,
      departmentStats,
      monthlyTrend,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};

// ================= Student Management ===================
exports.getAllStudents = async (req, res) => {
  try {
    const {
      search = "",
      page = 1,
      limit = 10,
      department = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = { role: "student" };

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { rollNumber: { $regex: search, $options: "i" } },
      ];
    }

    // Department filter
    if (department) {
      query.department = department;
    }

    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    const total = await User.countDocuments(query);
    const students = await User.find(query)
      .select("-password")
      .sort(sort)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    // Get enrollment counts for each student
    const studentsWithEnrollments = await Promise.all(
      students.map(async (student) => {
        const enrollmentCount = await Enrollment.countDocuments({
          student: student._id,
        });
        return {
          ...student.toObject(),
          enrolledClassesCount: enrollmentCount,
        };
      })
    );

    res.status(200).json({
      students: studentsWithEnrollments,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    console.error("Get students error:", error);
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const student = await User.findOne({
      _id: req.params.id,
      role: "student",
    }).select("-password");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Get enrolled classes
    const enrollments = await Enrollment.find({ student: student._id })
      .populate({
        path: "class",
        populate: { path: "teacher", select: "name email" },
      });

    const enrolledClasses = enrollments.map((e) => e.class).filter(Boolean);

    res.status(200).json({
      ...student.toObject(),
      enrolledClasses,
    });
  } catch (error) {
    console.error("Get student error:", error);
    res.status(500).json({ message: "Failed to fetch student" });
  }
};

exports.addStudent = async (req, res) => {
  try {
    const { name, email, password, contact, department, rollNumber, feeStatus } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password || "Student@123", 10);

    const student = new User({
      name,
      email,
      password: hashedPassword,
      role: "student",
      adminStatus: "approved",
      contact: contact || "",
      department: department || "",
      rollNumber: rollNumber || "",
      feeStatus: feeStatus || "",
    });

    await student.save();

    res.status(201).json({
      message: "Student added successfully",
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: student.role,
        contact: student.contact,
        department: student.department,
        rollNumber: student.rollNumber,
        feeStatus: student.feeStatus,
      },
    });
  } catch (error) {
    console.error("Add student error:", error);
    res.status(500).json({ message: "Failed to add student" });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { name, email, contact, department, rollNumber, feeStatus } = req.body;

    const student = await User.findOne({ _id: req.params.id, role: "student" });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check email uniqueness if changed
    if (email && email !== student.email) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    if (name) student.name = name;
    if (email) student.email = email;
    if (contact !== undefined) student.contact = contact;
    if (department !== undefined) student.department = department;
    if (rollNumber !== undefined) student.rollNumber = rollNumber;
    if (feeStatus !== undefined) student.feeStatus = feeStatus;

    await student.save();

    res.status(200).json({
      message: "Student updated successfully",
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: student.role,
        contact: student.contact,
        department: student.department,
        rollNumber: student.rollNumber,
        feeStatus: student.feeStatus,
        image: student.image,
      },
    });
  } catch (error) {
    console.error("Update student error:", error);
    res.status(500).json({ message: "Failed to update student" });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await User.findOne({ _id: req.params.id, role: "student" });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Delete all enrollments for this student
    await Enrollment.deleteMany({ student: student._id });

    // Delete the student
    await User.findByIdAndDelete(student._id);

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Delete student error:", error);
    res.status(500).json({ message: "Failed to delete student" });
  }
};

// ================= Teacher Management ===================
exports.getAllTeachers = async (req, res) => {
  try {
    const {
      search = "",
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = { role: "teacher" };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
      ];
    }

    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    const total = await User.countDocuments(query);
    const teachers = await User.find(query)
      .select("-password")
      .sort(sort)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    // Get class counts for each teacher
    const teachersWithClasses = await Promise.all(
      teachers.map(async (teacher) => {
        const classCount = await Class.countDocuments({
          teacher: teacher._id,
        });
        return {
          ...teacher.toObject(),
          assignedClassesCount: classCount,
        };
      })
    );

    res.status(200).json({
      teachers: teachersWithClasses,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    console.error("Get teachers error:", error);
    res.status(500).json({ message: "Failed to fetch teachers" });
  }
};

exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await User.findOne({
      _id: req.params.id,
      role: "teacher",
    }).select("-password");

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Get assigned classes
    const classes = await Class.find({ teacher: teacher._id });

    res.status(200).json({
      ...teacher.toObject(),
      assignedClasses: classes,
    });
  } catch (error) {
    console.error("Get teacher error:", error);
    res.status(500).json({ message: "Failed to fetch teacher" });
  }
};

exports.addTeacher = async (req, res) => {
  try {
    const { name, email, password, contact, department, qualification, experience } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password || "Teacher@123", 10);

    const teacher = new User({
      name,
      email,
      password: hashedPassword,
      role: "teacher",
      adminStatus: "approved",
      contact: contact || "",
      department: department || "",
      qualification: qualification || "",
      experience: experience || "",
    });

    await teacher.save();

    res.status(201).json({
      message: "Teacher added successfully",
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        role: teacher.role,
        contact: teacher.contact,
        department: teacher.department,
        qualification: teacher.qualification,
        experience: teacher.experience,
      },
    });
  } catch (error) {
    console.error("Add teacher error:", error);
    res.status(500).json({ message: "Failed to add teacher" });
  }
};

exports.updateTeacher = async (req, res) => {
  try {
    const { name, email, contact, department, qualification, experience } = req.body;

    const teacher = await User.findOne({ _id: req.params.id, role: "teacher" });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    if (email && email !== teacher.email) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    if (name) teacher.name = name;
    if (email) teacher.email = email;
    if (contact !== undefined) teacher.contact = contact;
    if (department !== undefined) teacher.department = department;
    if (qualification !== undefined) teacher.qualification = qualification;
    if (experience !== undefined) teacher.experience = experience;

    await teacher.save();

    res.status(200).json({
      message: "Teacher updated successfully",
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        role: teacher.role,
        contact: teacher.contact,
        department: teacher.department,
        qualification: teacher.qualification,
        experience: teacher.experience,
        image: teacher.image,
      },
    });
  } catch (error) {
    console.error("Update teacher error:", error);
    res.status(500).json({ message: "Failed to update teacher" });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await User.findOne({ _id: req.params.id, role: "teacher" });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Get all classes by this teacher
    const teacherClasses = await Class.find({ teacher: teacher._id });
    const classIds = teacherClasses.map((c) => c._id);

    // Delete all enrollments in those classes
    await Enrollment.deleteMany({ class: { $in: classIds } });

    // Delete all classes
    await Class.deleteMany({ teacher: teacher._id });

    // Delete the teacher
    await User.findByIdAndDelete(teacher._id);

    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    console.error("Delete teacher error:", error);
    res.status(500).json({ message: "Failed to delete teacher" });
  }
};

// ================= Admin Approval Management ===================
exports.getPendingAdmins = async (req, res) => {
  try {
    const pendingAdmins = await User.find({
      role: "admin",
      adminStatus: "pending",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(pendingAdmins);
  } catch (error) {
    console.error("Get pending admins error:", error);
    res.status(500).json({ message: "Failed to fetch pending admins" });
  }
};

exports.approveAdmin = async (req, res) => {
  try {
    const admin = await User.findOne({
      _id: req.params.id,
      role: "admin",
      adminStatus: "pending",
    });

    if (!admin) {
      return res
        .status(404)
        .json({ message: "Pending admin request not found" });
    }

    admin.adminStatus = "approved";
    admin.approvedBy = req.user._id;
    await admin.save();

    res.status(200).json({
      message: "Admin approved successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        adminStatus: admin.adminStatus,
      },
    });
  } catch (error) {
    console.error("Approve admin error:", error);
    res.status(500).json({ message: "Failed to approve admin" });
  }
};

exports.rejectAdmin = async (req, res) => {
  try {
    const admin = await User.findOne({
      _id: req.params.id,
      role: "admin",
      adminStatus: "pending",
    });

    if (!admin) {
      return res
        .status(404)
        .json({ message: "Pending admin request not found" });
    }

    admin.adminStatus = "rejected";
    await admin.save();

    res.status(200).json({
      message: "Admin request rejected",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        adminStatus: admin.adminStatus,
      },
    });
  } catch (error) {
    console.error("Reject admin error:", error);
    res.status(500).json({ message: "Failed to reject admin" });
  }
};

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({
      role: "admin",
      adminStatus: "approved",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(admins);
  } catch (error) {
    console.error("Get admins error:", error);
    res.status(500).json({ message: "Failed to fetch admins" });
  }
};

// ================= Seed Super Admin ===================
exports.seedSuperAdmin = async () => {
  try {
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;

    if (!superAdminEmail || !superAdminPassword) {
      console.warn("⚠️ SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD not configured in .env. Skipping Super Admin seeding.");
      return;
    }

    const existingAdmin = await User.findOne({ email: superAdminEmail });
    if (existingAdmin) {
      return; // Super admin already exists
    }

    const hashedPassword = await bcrypt.hash(superAdminPassword, 10);

    const superAdmin = new User({
      name: "Super Admin",
      email: superAdminEmail,
      password: hashedPassword,
      role: "admin",
      adminStatus: "approved",
      department: "Administration",
    });

    await superAdmin.save();
    console.log(`✅ Super Admin seeded: ${superAdminEmail}`);
  } catch (error) {
    console.error("Failed to seed Super Admin:", error.message);
  }
};
