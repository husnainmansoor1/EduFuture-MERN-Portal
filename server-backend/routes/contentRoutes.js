const express = require('express');
const router = express.Router();
const { upload } = require("../middleware/uploadMiddleware");
const contentController = require('../controllers/contentController');

const { protect } = require("../middleware/authMiddleware");

router.post(
  '/content',
  protect,
  upload.single("attachment"), 
  contentController.createContent
);

//  Route to get all content
router.get('/content/:classID', protect, contentController.getClassContent);

//  Route to get subject name by class ID 
router.get('/subject/:classID', contentController.getClassSubject);

//  Update content 
router.put(
  "/content/:id",
  protect,
  upload.single("attachment"),
  contentController.updateContent
);

//  Delete content
router.delete("/content/:id", protect, contentController.deleteContent);


module.exports = router;
