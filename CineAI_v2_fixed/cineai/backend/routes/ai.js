import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// In-memory job store (use Redis in production)
const jobs = new Map();

// POST /api/ai/generate-video
router.post('/generate-video', protect, async (req, res) => {
  try {
    const { prompt, style, duration, resolution, aspect, negativePrompt } = req.body;
    const user = await User.findById(req.user._id);

    if (user.aiCredits < 1)
      return res.status(402).json({ message: 'No AI credits. Please upgrade your plan.' });

    // Deduct credit
    user.aiCredits -= 1;
    await user.save();

    const jobId = `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const job   = {
      id: jobId, status: 'queued',
      prompt, style, duration, resolution, aspect,
      createdAt: new Date(), estimatedMs: (duration || 5) * 1000 + 3000,
      videoUrl: null, userId: user._id.toString(),
    };
    jobs.set(jobId, job);

    // Simulate async generation (replace with real Runway / Veo API call)
    setTimeout(() => {
      const j = jobs.get(jobId);
      if (j) { j.status = 'processing'; }
    }, 1000);
    setTimeout(() => {
      const j = jobs.get(jobId);
      if (j) { j.status = 'completed'; j.videoUrl = null; /* real URL from API */ }
    }, (duration || 5) * 1000 + 3000);

    res.json({
      success: true, jobId, status: 'queued',
      estimatedSeconds: (duration || 5) + 3,
      creditsRemaining: user.aiCredits,
      code: 'cstdineshroshan',
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/ai/status/:jobId
router.get('/status/:jobId', protect, async (req, res) => {
  const job = jobs.get(req.params.jobId);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  res.json({ ...job, code: 'cstdineshroshan' });
});

// GET /api/ai/credits
router.get('/credits', protect, async (req, res) => {
  const user = await User.findById(req.user._id).select('aiCredits plan');
  res.json({ credits: user.aiCredits, plan: user.plan });
});

// POST /api/ai/add-credits (admin / payment webhook)
router.post('/add-credits', protect, async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { $inc: { aiCredits: amount || 10 } }, { new: true });
    res.json({ credits: user.aiCredits });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
