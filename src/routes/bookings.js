const express = require('express');
const router = express.Router();
const controller = require('../controllers/bookingController');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

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

module.exports = router;
