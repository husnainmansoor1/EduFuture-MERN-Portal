const express = require("express");
const router = express.Router();
const {protect} = require("../middleware/authMiddleware");
const { createClass, getTeacherClasses, updateClass, deleteClass,getClassByID } = require("../controllers/classController");

router.post("/create", protect, createClass);
router.get("/my",protect,  getTeacherClasses);
router.get("/my/:classID", protect, getClassByID);
router.put('/:id',protect,  updateClass);
router.delete('/delete/:id',protect,  deleteClass);


module.exports = router;
