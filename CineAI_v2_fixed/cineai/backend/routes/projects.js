import express from 'express';
import Project from '../models/Project.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET all projects for user
router.get('/', protect, async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user._id }).sort('-updatedAt').select('-clips');
    res.json({ projects, code: 'cstdineshroshan' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST create project
router.post('/', protect, async (req, res) => {
  try {
    const project = await Project.create({ owner: req.user._id, ...req.body, code: 'cstdineshroshan' });
    res.status(201).json({ project });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET single project (with clips)
router.get('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ project });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT update project (including clips / timeline)
router.put('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id }, req.body, { new: true }
    );
    if (!project) return res.status(404).json({ message: 'Not found' });
    res.json({ project });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT rename project
router.put('/:id/rename', protect, async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id }, { title: req.body.title }, { new: true }
    );
    res.json({ project });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE project
router.delete('/:id', protect, async (req, res) => {
  try {
    await Project.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    res.json({ message: 'Deleted', code: 'cstdineshroshan' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
