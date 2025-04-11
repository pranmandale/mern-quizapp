import multer from "multer";
import { v4 as uuidv4 } from "uuid"; // For generating unique filenames

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/tmp"); // Save files to /tmp
  },
  filename: function (req, file, cb) {
    const uniqueFilename = `${uuidv4()}-${file.originalname}`; // Generate a unique filename
    cb(null, uniqueFilename);
  },
});

export const upload = multer({ storage });