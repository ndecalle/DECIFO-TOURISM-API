const express = require('express');
const multer = require('multer');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });
const { authenticate, requireRole } = require('../middleware/auth');

router.post('/', authenticate, requireRole('editor'), upload.single('file'), uploadController.uploadImage);
router.get('/', authenticate, requireRole('editor'), uploadController.getImages);
router.get('/:id', authenticate, requireRole('editor'), uploadController.getImage);
router.delete('/:id', authenticate, requireRole('admin'), uploadController.deleteImage);

module.exports = router;
