// middleware/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure "uploads" folder exists
const uploadDir = path.join("uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads"); // files saved to /uploads folder
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
    
  },
});

const upload = multer({ storage });

export default upload.fields([
  { name: "profileImg", maxCount: 1 },
  { name: "taskFileName", maxCount: 1 },
  { name: "submissionFile", maxCount: 1 },
]);
