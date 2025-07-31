import multer from "multer";
import { storage } from "../cloudinary.js";

const upload = multer({ storage });

export default upload.fields([
  { name: "profileImg", maxCount: 1 },
  { name: "taskFileName", maxCount: 1 },
  { name: "submissionFile", maxCount: 1 },
]);
