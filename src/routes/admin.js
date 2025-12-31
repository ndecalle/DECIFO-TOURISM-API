const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/auth');
const User = require('../models/User');
const adminController = require('../controllers/adminController');

// list users (admin only)
router.get('/users', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// create user (admin only)
router.post('/users', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    const bcrypt = require('bcrypt');
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User exists' });
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const user = new User({ name, email, passwordHash, role: role || 'editor' });
    await user.save();
    res.status(201).json({ id: user._id, email: user.email, name: user.name, role: user.role });
  } catch (err) {
    next(err);
  }
});

// reply to contact
router.post('/reply/:id', authenticate, requireRole('editor'), adminController.replyToContact);

module.exports = router;

