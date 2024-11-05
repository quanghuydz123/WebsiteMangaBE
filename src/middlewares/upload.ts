import multer from 'multer';

// Configure multer to store files in memory
 const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // Set a file size limit (10 MB in this example)
});

export default upload