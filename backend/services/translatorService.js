const DEFAULT_TRANSLATOR_ENDPOINT = 'https://api.cognitive.microsofttranslator.com';

const languageNames = new Intl.DisplayNames(['en'], { type: 'language' });

export const SUPPORTED_TRANSLATION_LANGUAGES = [
  {
    "code": "af",
    "name": "Afrikaans"
  },
  {
    "code": "sq",
    "name": "Albanian"
  },
  {
    "code": "am",
    "name": "Amharic"
  },
  {
    "code": "ar",
    "name": "Arabic"
  },
  {
    "code": "hy",
    "name": "Armenian"
  },
  {
    "code": "as",
    "name": "Assamese"
  },
  {
    "code": "az",
    "name": "Azerbaijani"
  },
  {
    "code": "bn",
    "name": "Bengali"
  },
  {
    "code": "bs",
    "name": "Bosnian"
  },
  {
    "code": "bg",
    "name": "Bulgarian"
  },
  {
    "code": "yue",
    "name": "Cantonese (Traditional)"
  },
  {
    "code": "ca",
    "name": "Catalan"
  },
  {
    "code": "zh-Hans",
    "name": "Chinese (Simplified)"
  },
  {
    "code": "zh-Hant",
    "name": "Chinese (Traditional)"
  },
  {
    "code": "hr",
    "name": "Croatian"
  },
  {
    "code": "cs",
    "name": "Czech"
  },
  {
    "code": "da",
    "name": "Danish"
  },
  {
    "code": "prs",
    "name": "Dari"
  },
  {
    "code": "dv",
    "name": "Divehi"
  },
  {
    "code": "nl",
    "name": "Dutch"
  },
  {
    "code": "en",
    "name": "English"
  },
  {
    "code": "et",
    "name": "Estonian"
  },
  {
    "code": "fj",
    "name": "Fijian"
  },
  {
    "code": "fil",
    "name": "Filipino"
  },
  {
    "code": "fi",
    "name": "Finnish"
  },
  {
    "code": "fr",
    "name": "French"
  },
  {
    "code": "fr-ca",
    "name": "French (Canada)"
  },
  {
    "code": "ka",
    "name": "Georgian"
  },
  {
    "code": "de",
    "name": "German"
  },
  {
    "code": "el",
    "name": "Greek"
  },
  {
    "code": "gu",
    "name": "Gujarati"
  },
  {
    "code": "ht",
    "name": "Haitian Creole"
  },
  {
    "code": "he",
    "name": "Hebrew"
  },
  {
    "code": "hi",
    "name": "Hindi"
  },
  {
    "code": "mww",
    "name": "Hmong Daw"
  },
  {
    "code": "hu",
    "name": "Hungarian"
  },
  {
    "code": "is",
    "name": "Icelandic"
  },
  {
    "code": "id",
    "name": "Indonesian"
  },
  {
    "code": "iu",
    "name": "Inuktitut"
  },
  {
    "code": "iu-Latn",
    "name": "Inuktitut (Latin)"
  },
  {
    "code": "ga",
    "name": "Irish"
  },
  {
    "code": "it",
    "name": "Italian"
  },
  {
    "code": "ja",
    "name": "Japanese"
  },
  {
    "code": "kn",
    "name": "Kannada"
  },
  {
    "code": "kk",
    "name": "Kazakh"
  },
  {
    "code": "km",
    "name": "Khmer"
  },
  {
    "code": "tlh-Latn",
    "name": "Klingon"
  },
  {
    "code": "ko",
    "name": "Korean"
  },
  {
    "code": "ku",
    "name": "Kurdish (Central)"
  },
  {
    "code": "kmr",
    "name": "Kurdish (Northern)"
  },
  {
    "code": "ky",
    "name": "Kyrgyz"
  },
  {
    "code": "lo",
    "name": "Lao"
  },
  {
    "code": "lv",
    "name": "Latvian"
  },
  {
    "code": "lt",
    "name": "Lithuanian"
  },
  {
    "code": "mk",
    "name": "Macedonian"
  },
  {
    "code": "mg",
    "name": "Malagasy"
  },
  {
    "code": "ms",
    "name": "Malay"
  },
  {
    "code": "ml",
    "name": "Malayalam"
  },
  {
    "code": "mt",
    "name": "Maltese"
  },
  {
    "code": "mi",
    "name": "Māori"
  },
  {
    "code": "mr",
    "name": "Marathi"
  },
  {
    "code": "mn-Cyrl",
    "name": "Mongolian (Cyrillic)"
  },
  {
    "code": "mn-Mong",
    "name": "Mongolian (Traditional)"
  },
  {
    "code": "my",
    "name": "Myanmar"
  },
  {
    "code": "ne",
    "name": "Nepali"
  },
  {
    "code": "nb",
    "name": "Norwegian"
  },
  {
    "code": "or",
    "name": "Odia"
  },
  {
    "code": "ps",
    "name": "Pashto"
  },
  {
    "code": "fa",
    "name": "Persian"
  },
  {
    "code": "pl",
    "name": "Polish"
  },
  {
    "code": "pt",
    "name": "Portuguese"
  },
  {
    "code": "pt-pt",
    "name": "Portuguese (Portugal)"
  },
  {
    "code": "pa",
    "name": "Punjabi"
  },
  {
    "code": "otq",
    "name": "Querétaro Otomi"
  },
  {
    "code": "ro",
    "name": "Romanian"
  },
  {
    "code": "ru",
    "name": "Russian"
  },
  {
    "code": "sm",
    "name": "Samoan"
  },
  {
    "code": "sr-Cyrl",
    "name": "Serbian (Cyrillic)"
  },
  {
    "code": "sr-Latn",
    "name": "Serbian (Latin)"
  },
  {
    "code": "sk",
    "name": "Slovak"
  },
  {
    "code": "sl",
    "name": "Slovenian"
  },
  {
    "code": "es",
    "name": "Spanish"
  },
  {
    "code": "sw",
    "name": "Swahili"
  },
  {
    "code": "sv",
    "name": "Swedish"
  },
  {
    "code": "ty",
    "name": "Tahitian"
  },
  {
    "code": "ta",
    "name": "Tamil"
  },
  {
    "code": "te",
    "name": "Telugu"
  },
  {
    "code": "th",
    "name": "Thai"
  },
  {
    "code": "bo",
    "name": "Tibetan"
  },
  {
    "code": "ti",
    "name": "Tigrinya"
  },
  {
    "code": "to",
    "name": "Tongan"
  },
  {
    "code": "tr",
    "name": "Turkish"
  },
  {
    "code": "tk",
    "name": "Turkmen"
  },
  {
    "code": "uk",
    "name": "Ukrainian"
  },
  {
    "code": "ur",
    "name": "Urdu"
  },
  {
    "code": "ug",
    "name": "Uyghur"
  },
  {
    "code": "uz",
    "name": "Uzbek"
  },
  {
    "code": "vi",
    "name": "Vietnamese"
  },
  {
    "code": "cy",
    "name": "Welsh"
  },
  {
    "code": "yua",
    "name": "Yucatec Maya"
  },
  {
    "code": "zu",
    "name": "Zulu"
  }
];

function clean(value = '') {
  return String(value || '').trim();
}

function normalizeLanguageCode(value = '', fallback = 'en') {
  const normalized = clean(value);
  if (!normalized) return fallback;
  const aliases = {
    english: 'en', french: 'fr', spanish: 'es', arabic: 'ar',
    portuguese: 'pt', swahili: 'sw', hindi: 'hi', urdu: 'ur', chinese: 'zh-Hans', mandarin: 'zh-Hans',
  };
  return aliases[normalized.toLowerCase()] || normalized;
}

export function getLanguageName(code = '') {
  const normalized = normalizeLanguageCode(code, 'en');
  return SUPPORTED_TRANSLATION_LANGUAGES.find((item) => item.code.toLowerCase() === normalized.toLowerCase())?.name || languageNames.of(normalized) || normalized;
}

export function isTranslatorConfigured() {
  return Boolean(clean(process.env.AZURE_TRANSLATOR_KEY || process.env.TRANSLATOR_TEXT_SUBSCRIPTION_KEY));
}

export async function translateText({ text, from = '', to = 'en' } = {}) {
  const sourceText = clean(text);
  const targetLanguage = normalizeLanguageCode(to, 'en');
  const sourceLanguage = normalizeLanguageCode(from, '');

  if (!sourceText) {
    return {
      translatedText: '',
      detectedLanguage: sourceLanguage || '',
      targetLanguage,
      targetLanguageName: getLanguageName(targetLanguage),
      provider: 'none',
      status: 'skipped_empty_text',
    };
  }

  if (!isTranslatorConfigured()) {
    return {
      translatedText: sourceText,
      detectedLanguage: sourceLanguage || '',
      targetLanguage,
      targetLanguageName: getLanguageName(targetLanguage),
      provider: 'azure',
      status: 'not_configured_original_returned',
    };
  }

  const key = clean(process.env.AZURE_TRANSLATOR_KEY || process.env.TRANSLATOR_TEXT_SUBSCRIPTION_KEY);
  const region = clean(process.env.AZURE_TRANSLATOR_REGION || process.env.TRANSLATOR_TEXT_REGION);
  const endpoint = clean(process.env.AZURE_TRANSLATOR_ENDPOINT || process.env.TRANSLATOR_TEXT_ENDPOINT || DEFAULT_TRANSLATOR_ENDPOINT).replace(/\/+$/, '');
  const url = new URL('/translate', endpoint);
  url.searchParams.set('api-version', '3.0');
  url.searchParams.set('to', targetLanguage);
  if (sourceLanguage) url.searchParams.set('from', sourceLanguage);

  const headers = {
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': key,
  };
  if (region) headers['Ocp-Apim-Subscription-Region'] = region;

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify([{ text: sourceText }]),
  });

  const bodyText = await response.text();
  let payload;
  try { payload = bodyText ? JSON.parse(bodyText) : null; } catch (_error) { payload = null; }

  if (!response.ok) {
    const message = payload?.error?.message || payload?.message || bodyText || `Azure Translator failed with status ${response.status}`;
    throw new Error(message);
  }

  const first = Array.isArray(payload) ? payload[0] : null;
  const translation = first?.translations?.[0];
  return {
    translatedText: clean(translation?.text) || sourceText,
    detectedLanguage: sourceLanguage || first?.detectedLanguage?.language || '',
    detectedLanguageScore: first?.detectedLanguage?.score || null,
    targetLanguage,
    targetLanguageName: getLanguageName(targetLanguage),
    provider: 'azure',
    status: 'translated',
  };
}
