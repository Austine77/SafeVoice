import { Router } from 'express';
import User from '../models/User.js';
import { validatePortalLogin } from '../middleware/auth.js';
import { isFileDbEnabled, readDb } from '../lib/fileDb.js';

const router = Router();

async function findPortalUser(role, normalizedUsername) {
  if (isFileDbEnabled()) {
    const db = await readDb();
    return db.users.find((user) => user.role === role && user.username === normalizedUsername && user.isActive !== false) || null;
  }
  return User.findOne({ username: normalizedUsername, role, isActive: true }).lean();
}

async function authenticatePortalUser({ role, username, password, fallbackUsername, fallbackPassword }) {
  const normalizedUsername = String(username || '').trim();
  const normalizedPassword = String(password || '').trim();

  const databaseUser = await findPortalUser(role, normalizedUsername);
  if (databaseUser) {
    return validatePortalLogin(databaseUser.username, databaseUser.password, normalizedUsername, normalizedPassword);
  }

  return validatePortalLogin(fallbackUsername, fallbackPassword, normalizedUsername, normalizedPassword);
}

router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const ok = await authenticatePortalUser({
      role: 'admin', username, password,
      fallbackUsername: process.env.ADMIN_USERNAME,
      fallbackPassword: process.env.ADMIN_PASSWORD,
    });
    if (!ok) return res.status(401).json({ message: 'Invalid admin credentials.' });
    return res.json({ role: 'admin', message: 'Admin login successful.' });
  } catch (error) {
    return res.status(500).json({ message: 'Admin login failed.', error: error.message });
  }
});

router.post('/worker/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const ok = await authenticatePortalUser({
      role: 'worker', username, password,
      fallbackUsername: process.env.SOCIAL_WORKER_USERNAME,
      fallbackPassword: process.env.SOCIAL_WORKER_PASSWORD,
    });
    if (!ok) return res.status(401).json({ message: 'Invalid social worker credentials.' });
    return res.json({ role: 'worker', message: 'Social worker login successful.' });
  } catch (error) {
    return res.status(500).json({ message: 'Social worker login failed.', error: error.message });
  }
});

export default router;
