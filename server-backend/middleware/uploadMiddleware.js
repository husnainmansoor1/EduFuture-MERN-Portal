const multer = require("multer");
const path = require("path");

const storage = (folder) => multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, folder + "/"); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage: storage("uploads") });
const profileUpload = multer({ storage: storage("profile_images") });

module.exports = { upload, profileUpload };
