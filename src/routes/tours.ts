import express from 'express';
import multer from 'multer';
import * as controller from '../controllers/tourController';
import { authenticate, requireRole } from '../middleware/auth';
import { body, param, query } from 'express-validator';
import validate from '../middleware/validate';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.post(
	'/',
	authenticate,
	requireRole('editor'),
	upload.single('file'),
	[
		body('title').isLength({ min: 1 }).withMessage('Title required'),
		body('slug').optional().isString(),
		body('price').optional().isNumeric().withMessage('Price must be numeric'),
	],
	validate,
	controller.createTour
);

router.get(
	'/',
	[
		query('page').optional().toInt(),
		query('limit').optional().toInt(),
		query('featured').optional().isBoolean().toBoolean()
	],
	validate,
	controller.listTours
);

router.get('/:id', [param('id').isMongoId().withMessage('Invalid id')], validate, controller.getTour);

router.put('/:id', authenticate, requireRole('editor'), upload.single('file'), [param('id').isMongoId().withMessage('Invalid id')], validate, controller.updateTour);
router.delete('/:id', authenticate, requireRole('admin'), [param('id').isMongoId().withMessage('Invalid id')], validate, controller.deleteTour);

export default router;
