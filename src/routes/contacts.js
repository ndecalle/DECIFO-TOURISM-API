const express = require('express');
const router = express.Router();
const controller = require('../controllers/contactController');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

router.post(
	'/',
	[
		body('name').isLength({ min: 1 }).withMessage('Name is required'),
		body('email').isEmail().withMessage('Valid email is required'),
		body('message').isLength({ min: 5 }).withMessage('Message is required')
	],
	validate,
	controller.createContact
);

router.get('/', controller.listContacts);
router.put('/:id/status', controller.updateContactStatus);

module.exports = router;
