import express from 'express';
import multer from 'multer';
import * as uploadController from '../controllers/uploadController';
import { authenticate, requireRole } from '../middleware/auth';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/', authenticate, requireRole('editor'), upload.single('file'), uploadController.uploadImage);
router.get('/', authenticate, uploadController.getImages);
router.get('/:id', authenticate, requireRole('editor'), uploadController.getImage);
router.delete('/:id', authenticate, requireRole('admin'), uploadController.deleteImage);

export default router;
