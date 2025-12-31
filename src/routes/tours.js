const express = require('express');

const router = express.Router();
const controller = require('../controllers/tourController');
const { authenticate, requireRole } = require('../middleware/auth');
const { body, param, query } = require('express-validator');
const validate = require('../middleware/validate');

router.post(
	'/',
	authenticate,
	requireRole('editor'),
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

router.put('/:id', authenticate, requireRole('editor'), [param('id').isMongoId().withMessage('Invalid id')], validate, controller.updateTour);
router.delete('/:id', authenticate, requireRole('admin'), [param('id').isMongoId().withMessage('Invalid id')], validate, controller.deleteTour);

module.exports = router;
