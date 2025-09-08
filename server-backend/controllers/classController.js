const Class = require("../models/Class");
const { nanoid } = require("nanoid"); // npm install nanoid

exports.createClass = async (req, res) => {
  try {
    const { subject, program, room } = req.body;
    const code = nanoid(6); // short, unique code

    const newClass = new Class({
      subject,
      program,
      room,
      code,
      teacher: req.user.id,
    });

    await newClass.save();
    res.status(201).json(newClass);
  } catch (err) {
    res.status(500).json({ message: "Failed to create class" });
  }
};

// PUT /api/classes/:id
exports.updateClass = async (req, res) => {
  const { id } = req.params;
  const { subject, program, room } = req.body;

  try {
    const updatedClass = await Class.findByIdAndUpdate(
      id,
      { subject, program, room },
      { new: true }
    );
 if (!updatedClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.status(200).json(updatedClass);
  } catch (err) {
    res.status(500).json({ message: "Failed to update class", error: err.message });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const classId = req.params.id;
    await Class.findByIdAndDelete(classId);
    res.status(200).json({ message: "Class deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete class", error });
  }
};



exports.getTeacherClasses = async (req, res) => {
  try {
    const classes = await Class.find({ teacher: req.user.id });
    res.json(classes);
  } catch {
    res.status(500).json({ message: "Failed to fetch classes" });
  }
};
exports.getClassByID = async (req, res) => {
  try {
    const classData = await Class.findOne({
      _id: req.params.classID,
      teacherID: req.user._id, //  this filters only the logged-in teacher's class
    });

    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.status(200).json(classData);
  } catch (error) {
    console.error("Error fetching class:", error);
    res.status(500).json({ message: "Server error" });
  }
};