const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["teacher", "student", "admin"],
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    // Admin approval workflow
    adminStatus: {
      type: String,
      enum: ["approved", "pending", "rejected"],
      default: function () {
        return this.role === "admin" ? "pending" : "approved";
      },
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    // Additional profile fields
    contact: {
      type: String,
      default: "",
    },
    department: {
      type: String,
      default: "",
    },
    // Teacher-specific fields
    qualification: {
      type: String,
      default: "",
    },
    experience: {
      type: String,
      default: "",
    },
    // Student-specific fields
    rollNumber: {
      type: String,
      default: "",
    },
    feeStatus: {
      type: String,
      enum: ["paid", "unpaid", "partial", ""],
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
