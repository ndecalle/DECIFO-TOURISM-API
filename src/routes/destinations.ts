import express from 'express';
import multer from 'multer';
import * as controller from '../controllers/destinationController';
import { authenticate, requireRole } from '../middleware/auth';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/', authenticate, requireRole('editor'), upload.single('file'), controller.createDestination);
router.get('/', controller.listDestinations);
router.get('/:id', controller.getDestination);
router.put('/:id', authenticate, requireRole('editor'), upload.single('file'), controller.updateDestination);
router.delete('/:id', authenticate, requireRole('admin'), controller.deleteDestination);

export default router;
