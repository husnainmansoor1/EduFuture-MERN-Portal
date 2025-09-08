const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  subject: String,
  program: String,
  room: String,
  code: {
    type: String,
    unique: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Class", classSchema);
