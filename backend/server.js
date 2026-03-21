import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import caseRoutes from './routes/caseRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const USE_FILE_DB = String(process.env.USE_FILE_DB || 'false').toLowerCase() === 'true';

const CLIENT_URL = process.env.CLIENT_URL;
app.use(cors({ origin: CLIENT_URL ? [CLIENT_URL] : true }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'safevoice-backend', storage: USE_FILE_DB ? 'file' : 'mongodb' });
});

app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);

async function start() {
  try {
    if (!USE_FILE_DB) {
      if (!MONGODB_URI) throw new Error('MONGODB_URI is missing in backend/.env');
      await mongoose.connect(MONGODB_URI);
    }

    app.listen(PORT, () => {
      console.log(`SafeVoice backend running on http://localhost:${PORT}`);
      if (USE_FILE_DB) {
        console.log('Using local file database mode (backend/data/safevoice-db.json).');
      }
    });
  } catch (error) {
    console.error('Failed to start backend:', error.message);
    process.exit(1);
  }
}

start();
