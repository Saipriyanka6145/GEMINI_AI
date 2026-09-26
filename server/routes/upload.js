import express from 'express';
import multer from 'multer';
import { processDocument } from '../services/documentService.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

router.post('/', upload.array('files', 10), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }
    const results = [];
    for (const file of req.files) {
      const text = await processDocument(file);
      if (!text || !text.trim()) {
        return res.status(400).json({ error: `File ${file.originalname} contains no readable text.` });
      }
      results.push({ name: file.originalname, text, size: file.size, type: file.mimetype });
    }
    res.json({ sources: results });
  } catch (err) {
    next(err);
  }
});

export default router;
