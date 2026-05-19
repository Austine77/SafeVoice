import { Router } from 'express';
import { getCategoryLabels, getContacts, getCountries, getDirectoryMeta } from '../services/globalDirectoryService.js';

const router = Router();

router.get('/meta', (_req, res) => {
  res.json({ success: true, ...getDirectoryMeta() });
});

router.get('/countries', (_req, res) => {
  res.json({ success: true, countries: getCountries(), categories: getCategoryLabels(), meta: getDirectoryMeta() });
});

router.get('/contacts', (req, res) => {
  const results = getContacts({
    country: req.query.country || req.query.countryCode,
    category: req.query.category,
    q: req.query.q,
    verificationStatus: req.query.verificationStatus,
  });
  res.json({ success: true, count: results.length, results, meta: getDirectoryMeta() });
});

export default router;
