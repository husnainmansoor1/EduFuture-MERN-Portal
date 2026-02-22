const Content = require("../models/ContentModel");
const Class = require("../models/Class");
const mongoose = require("mongoose");

exports.createContent = async (req, res) => {
  try {
    console.log(" Received content post:", req.body);
    console.log(" Uploaded file:", req.file);

    const { text, linkUrl, classID } = req.body;
    const teacherID = req.user._id;
    let fileUrl = "";

    if (req.file) {
      fileUrl = req.file.path.replace(/\\/g, "/");
    }

    const newContent = await Content.create({
      text,
      linkUrl,
      classID,
      teacherID,
      fileUrl,
    });

    res.status(201).json(newContent);
  } catch (error) {
    console.error(" Error posting content:", error);
    res.status(500).json({ message: "Failed to post content" });
  }
};


exports.getClassContent = async (req, res) => {
  try {
    const { classID } = req.params;

    //  Validate ObjectId
    if (!mongoose.isValidObjectId(classID)) {
      return res.status(400).json({ message: "Invalid class ID" });
    }

    const contentList = await Content.find({
      classID: new mongoose.Types.ObjectId(classID),
    })
      .populate("teacherID", "name image")       
      .populate("classID");                
    res.status(200).json(contentList);
  } catch (error) {
    console.error(" Error fetching content:", error);
    res.status(500).json({ message: "Failed to fetch content" });
  }
};


exports.getClassSubject = async (req, res) => {
  try {
    const { classID } = req.params;
    const classData = await Class.findById(classID);
console.log(JSON.stringify(classData, null, 2));
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }
;
    res.status(200).json(classData)
    
    
  } catch (error) {
    console.error("Error fetching subject:", error);
    res.status(500).json({ message: "Failed to fetch subject" });
  }
};

// Update content
exports.updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, linkUrl } = req.body;

    const content = await Content.findById(id);

    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    // Ensure only the teacher who created it can edit
    if (content.teacherID.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this content" });
    }

    content.text = text || content.text;
    content.linkUrl = linkUrl || content.linkUrl;

    if (req.file) {
      content.fileUrl = req.file.path.replace(/\\/g, "/"); // new file uploaded
    }

    const updated = await content.save();
    res.status(200).json(updated);
  } catch (error) {
    console.error(" Error updating content:", error);
    res.status(500).json({ message: "Failed to update content" });
  }
};

// Delete content
exports.deleteContent = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await Content.findById(id);
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    if (content.teacherID.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this content" });
    }

    await content.deleteOne();
    res.status(200).json({ message: "Content deleted successfully" });
  } catch (error) {
    console.error(" Error deleting content:", error);
    res.status(500).json({ message: "Failed to delete content" });
  }
};

