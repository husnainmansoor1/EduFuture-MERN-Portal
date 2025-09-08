const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  enrolledAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure a student can't enroll in the same class twice
enrollmentSchema.index({ student: 1, class: 1 }, { unique: true });

module.exports = mongoose.model("Enrollment", enrollmentSchema);