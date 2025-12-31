const express = require('express');

const router = express.Router();
const controller = require('../controllers/destinationController');
const { authenticate, requireRole } = require('../middleware/auth');

router.post('/', authenticate, requireRole('editor'), controller.createDestination);
router.get('/', controller.listDestinations);
router.get('/:id', controller.getDestination);
router.put('/:id', authenticate, requireRole('editor'), controller.updateDestination);
router.delete('/:id', authenticate, requireRole('admin'), controller.deleteDestination);

module.exports = router;
