import express from 'express';
import * as controller from '../controllers/contactController';
import { body } from 'express-validator';
import validate from '../middleware/validate';

const router = express.Router();

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

export default router;
