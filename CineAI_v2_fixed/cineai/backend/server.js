import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes    from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import aiRoutes      from './routes/ai.js';
import creatorRoutes from './routes/creator.js';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'], credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/auth',    authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/ai',      aiRoutes);
app.use('/api/creator', creatorRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status:    'ok',
    app:       'Vidora',
    version:   '2.0.0',
    code:      'Vidora',
    timestamp: new Date().toISOString(),
  });
});

// 404
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

// Connect MongoDB then start
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅  MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🎬  Vidora backend running → http://localhost:${PORT}`);
      console.log(`    Code: cstdineshroshan`);
    });
  })
  .catch(err => {
    console.error('❌  MongoDB error:', err.message);
    // Run without DB in dev
    app.listen(PORT, () => {
      console.log(`⚠️   Vidora running WITHOUT DB → http://localhost:${PORT}`);
    });
  });
