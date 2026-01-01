import express from 'express';
import * as controller from '../controllers/testimonialController';
import { authenticate, requireRole } from '../middleware/auth';

const router = express.Router();

router.post('/', controller.createTestimonial); // public, pending approval
router.get('/', controller.listTestimonials);
router.put('/:id', authenticate, requireRole('editor'), controller.updateTestimonial);
router.delete('/:id', authenticate, requireRole('admin'), controller.deleteTestimonial);

export default router;
