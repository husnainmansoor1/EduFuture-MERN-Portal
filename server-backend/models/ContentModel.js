// models/ContentModel.js
const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  teacherID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  classID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    default: '',
  },
  linkUrl: {
    type: String,
    default: '',
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Content', contentSchema);
