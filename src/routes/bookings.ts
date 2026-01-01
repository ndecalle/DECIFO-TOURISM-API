import express from 'express';
import * as controller from '../controllers/bookingController';
import { body } from 'express-validator';
import validate from '../middleware/validate';

const router = express.Router();

router.post(
	'/',
	[
		body('name').isLength({ min: 1 }).withMessage('Name required'),
		body('email').isEmail().withMessage('Valid email required'),
		body('tour').optional().isMongoId().withMessage('Tour must be an id'),
	],
	validate,
	controller.createBooking
);

router.get('/', controller.listBookings);
router.get('/:id', controller.getBooking);
router.put('/:id', controller.updateBooking);
router.delete('/:id', controller.deleteBooking);

export default router;
