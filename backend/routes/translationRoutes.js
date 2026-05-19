import { Router } from 'express';
import { getLanguageName, isTranslatorConfigured, SUPPORTED_TRANSLATION_LANGUAGES, translateText } from '../services/translatorService.js';

const router = Router();

router.get('/languages', (_req, res) => {
  res.json({ success: true, configured: isTranslatorConfigured(), languages: SUPPORTED_TRANSLATION_LANGUAGES });
});

router.post('/translate', async (req, res) => {
  try {
    const result = await translateText({ text: req.body?.text, from: req.body?.from, to: req.body?.to || 'en' });
    res.json({ success: true, ...result, targetLanguageName: result.targetLanguageName || getLanguageName(result.targetLanguage) });
  } catch (error) {
    res.status(502).json({ success: false, message: 'Translation failed.', error: error.message });
  }
});

export default router;
