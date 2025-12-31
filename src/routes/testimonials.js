const express = require('express');
const router = express.Router();
const controller = require('../controllers/testimonialController');
const { authenticate, requireRole } = require('../middleware/auth');

router.post('/', controller.createTestimonial); // public, pending approval
router.get('/', controller.listTestimonials);
router.put('/:id', authenticate, requireRole('editor'), controller.updateTestimonial);
router.delete('/:id', authenticate, requireRole('admin'), controller.deleteTestimonial);

module.exports = router;
