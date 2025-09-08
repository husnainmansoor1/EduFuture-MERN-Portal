const express = require('express');
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const contentController = require('../controllers/contentController');

// Multer middleware for file upload
const upload = require("../middleware/uploadMiddleware");

//  Route to create content with optional file upload
router.post(
  '/content',
  protect,
  upload.single("attachment"), // "attachment" = field name from frontend FormData
  contentController.createContent
);

//  Route to get all content for a specific class
router.get('/content/:classID', protect, contentController.getClassContent);

//  Route to get subject name by class ID (no auth required)
router.get('/subject/:classID', contentController.getClassSubject);

//  Update content (with optional new file upload)
router.put(
  "/content/:id",
  protect,
  upload.single("attachment"),
  contentController.updateContent
);

//  Delete content
router.delete("/content/:id", protect, contentController.deleteContent);


module.exports = router;
