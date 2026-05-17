import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';
import Project from '../models/Project.js';

const router = express.Router();

// GET /api/creator/:handle  — public profile
router.get('/:handle', async (req, res) => {
  try {
    const user = await User.findOne({ 'creatorSpace.handle': req.params.handle })
      .select('-password')
      .populate('creatorSpace.publishedProjects', 'title thumbnail views likes duration tags');
    if (!user) return res.status(404).json({ message: 'Creator not found' });
    res.json({ creator: user, code: 'cstdineshroshan' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/creator/follow/:userId
router.post('/follow/:userId', protect, async (req, res) => {
  try {
    if (req.params.userId === req.user._id.toString())
      return res.status(400).json({ message: 'Cannot follow yourself' });
    const target = await User.findById(req.params.userId);
    if (!target) return res.status(404).json({ message: 'User not found' });
    const isFollowing = target.creatorSpace.followers.includes(req.user._id);
    if (isFollowing) {
      target.creatorSpace.followers.pull(req.user._id);
      await User.findByIdAndUpdate(req.user._id, { $pull: { 'creatorSpace.following': req.params.userId } });
    } else {
      target.creatorSpace.followers.push(req.user._id);
      await User.findByIdAndUpdate(req.user._id, { $push: { 'creatorSpace.following': req.params.userId } });
    }
    await target.save();
    res.json({ following: !isFollowing, followers: target.creatorSpace.followers.length });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/creator/publish/:projectId
router.put('/publish/:projectId', protect, async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.projectId, owner: req.user._id },
      { isPublished: true, isPublic: true }, { new: true }
    );
    if (!project) return res.status(404).json({ message: 'Project not found' });
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { 'creatorSpace.publishedProjects': project._id }
    });
    res.json({ project, code: 'cstdineshroshan' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/creator/feed/explore
router.get('/feed/explore', async (req, res) => {
  try {
    const creators = await User.find({ 'creatorSpace.publishedProjects.0': { $exists: true } })
      .select('username creatorSpace.displayName creatorSpace.handle creatorSpace.totalViews')
      .limit(20);
    res.json({ creators, code: 'cstdineshroshan' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/creator/profile  — update creator profile fields
router.put('/profile/update', protect, async (req, res) => {
  try {
    const { displayName, handle, bio, banner } = req.body;
    const update = {};
    if (displayName) update['creatorSpace.displayName'] = displayName;
    if (handle)      update['creatorSpace.handle']      = handle.toLowerCase().replace(/\s+/g, '_');
    if (bio)         update['bio']                      = bio;
    if (banner)      update['creatorSpace.banner']      = banner;
    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true }).select('-password');
    res.json({ user, code: 'cstdineshroshan' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
