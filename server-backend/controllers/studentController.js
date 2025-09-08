const Class = require("../models/Class");
const Enrollment = require("../models/Enrollment");
const User = require("../models/User");

// Join a class using class code
exports.joinClass = async (req, res) => {
  try {
    const { code } = req.body;
    const studentId = req.user._id;

    // Find the class by code
    const classData = await Class.findOne({ code }).populate("teacher", "name");

    if (!classData) {
      return res
        .status(404)
        .json({ message: "Class not found. Please check the class code." });
    }

    // Check if student is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      class: classData._id,
    });

    if (existingEnrollment) {
      return res
        .status(400)
        .json({ message: "You are already enrolled in this class." });
    }

    // Create new enrollment
    const enrollment = new Enrollment({
      student: studentId,
      class: classData._id,
    });

    await enrollment.save();

    res.status(201).json({
      message: "Successfully joined the class!",
      class: classData,
    });
  } catch (error) {
    console.error("Error joining class:", error);
    res.status(500).json({ message: "Failed to join class" });
  }
};

// Get all enrolled classes for a student
exports.getEnrolledClasses = async (req, res) => {
  try {
    const studentId = req.user._id;

    const enrollments = await Enrollment.find({ student: studentId })
      .populate({
        path: "class",
        populate: {
          path: "teacher",
          select: "name email",
        },
      })
      .sort({ enrolledAt: -1 });

    const classes = enrollments.map((enrollment) => enrollment.class);

    res.status(200).json(classes);
  } catch (error) {
    console.error("Error fetching enrolled classes:", error);
    res.status(500).json({ message: "Failed to fetch enrolled classes" });
  }
};

// Leave a class
exports.leaveClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const studentId = req.user._id;

    const enrollment = await Enrollment.findOneAndDelete({
      student: studentId,
      class: classId,
    });

    if (!enrollment) {
      return res
        .status(404)
        .json({ message: "You are not enrolled in this class." });
    }

    res.status(200).json({ message: "Successfully left the class." });
  } catch (error) {
    console.error("Error leaving class:", error);
    res.status(500).json({ message: "Failed to leave class" });
  }
};

// Get class details for a student
exports.getStudentClassDetails = async (req, res) => {
  try {
    const { classId } = req.params;
    const studentId = req.user._id;

    // Check if student is enrolled in this class
    const enrollment = await Enrollment.findOne({
      student: studentId,
      class: classId,
    });

    if (!enrollment) {
      return res
        .status(403)
        .json({ message: "You are not enrolled in this class." });
    }

    const classData = await Class.findById(classId).populate(
      "teacher",
      "name email"
    );

    if (!classData) {
      return res.status(404).json({ message: "Class not found." });
    }

    res.status(200).json(classData);
  } catch (error) {
    console.error("Error fetching class details:", error);
    res.status(500).json({ message: "Failed to fetch class details" });
  }
};
