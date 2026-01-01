import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { authenticate, requireRole } from '../middleware/auth';
import User from '../models/User';
import * as adminController from '../controllers/adminController';

const router = express.Router();

// list users (admin only)
router.get('/users', authenticate, requireRole('admin'), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// create user (admin only)
router.post('/users', authenticate, requireRole('admin'), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password required' });
      return;
    }
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ message: 'User exists' });
      return;
    }
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

export default router;

