import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { generateToken, protect } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: 'All fields required' });

    // Fallback if DB is disconnected
    if (mongoose.connection.readyState !== 1) {
      const mockUser = { _id: 'demo_user', username, email, role: role || 'creator', code: 'cstdineshroshan' };
      return res.status(201).json({
        token: generateToken(mockUser._id),
        user:  mockUser,
        message: 'Running in Demo Mode (No DB)'
      });
    }

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(409).json({ message: 'Email or username already taken' });

    const user = await User.create({ username, email, password, role: role || 'creator', code: 'cstdineshroshan' });

    res.status(201).json({
      token: generateToken(user._id),
      user:  user.toPublicJSON(),
      code:  'cstdineshroshan',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Fallback if DB is disconnected
    if (mongoose.connection.readyState !== 1) {
      const mockUser = { _id: 'demo_user', username: email.split('@')[0], email, role: 'creator', code: 'cstdineshroshan' };
      return res.json({
        token: generateToken(mockUser._id),
        user:  mockUser,
        message: 'Logged in as Demo User (No DB)'
      });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const ok = await user.comparePassword(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid email or password' });

    res.json({
      token: generateToken(user._id),
      user:  user.toPublicJSON(),
      code:  'cstdineshroshan',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', protect, (req, res) => {
  res.json({ user: req.user, code: 'cstdineshroshan' });
});

// PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true }).select('-password');
    res.json({ user, code: 'cstdineshroshan' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
