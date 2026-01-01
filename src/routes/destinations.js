const express = require('express');

const router = express.Router();
const multer = require('multer');
const controller = require('../controllers/destinationController');
const { authenticate, requireRole } = require('../middleware/auth');

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/', authenticate, requireRole('editor'), upload.single('file'), controller.createDestination);
router.get('/', controller.listDestinations);
router.get('/:id', controller.getDestination);
router.put('/:id', authenticate, requireRole('editor'), upload.single('file'), controller.updateDestination);
router.delete('/:id', authenticate, requireRole('admin'), controller.deleteDestination);

module.exports = router;
