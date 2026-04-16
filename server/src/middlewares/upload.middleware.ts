// src/middlewares/upload.middleware.ts

import multer from "multer";
import path from "path";

// Define storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueName);
  },
});

// File filter to allow only PDFs and TXT files
const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  const allowedTypes = ["application/pdf", "text/plain"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and TXT files are allowed"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});