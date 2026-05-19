import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.resolve(__dirname, '../data/globalDirectory.json');

const countryNames = new Intl.DisplayNames(['en'], { type: 'region' });

const CATEGORY_LABELS = {
  emergency: 'Emergency services',
  police: 'Police / law enforcement',
  child_protection: 'Child protection / social welfare',
  social_support: 'Social support / protection agency',
};

const COUNTRY_ALIASES = {
  nigeria: 'NG',
  'united states': 'US',
  'united states of america': 'US',
  usa: 'US',
  america: 'US',
  'united kingdom': 'GB',
  uk: 'GB',
  england: 'GB',
  britain: 'GB',
  canada: 'CA',
  ghana: 'GH',
  kenya: 'KE',
  'south africa': 'ZA',
  india: 'IN',
  pakistan: 'PK',
  bangladesh: 'BD',
  france: 'FR',
  germany: 'DE',
  spain: 'ES',
  italy: 'IT',
  brazil: 'BR',
  mexico: 'MX',
  australia: 'AU',
  japan: 'JP',
  china: 'CN',
  'european union': 'EU',
  eu: 'EU',
};

let cache = null;

function readDirectoryFile() {
  if (cache) return cache;
  try {
    const parsed = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    cache = {
      generatedAt: parsed.generatedAt || null,
      warning: parsed.warning || '',
      contacts: Array.isArray(parsed.contacts) ? parsed.contacts : [],
    };
  } catch (error) {
    cache = {
      generatedAt: null,
      warning: 'Global directory file is missing or invalid. Restore backend/data/globalDirectory.json.',
      contacts: [],
    };
  }
  return cache;
}

export function normalizeCountryCode(value = '') {
  const raw = String(value || '').trim();
  if (!raw) return '';
  const upper = raw.toUpperCase();
  if (upper === 'EU') return 'EU';
  if (/^[A-Z]{2}$/.test(upper)) return upper;
  return COUNTRY_ALIASES[raw.toLowerCase()] || upper.slice(0, 2);
}

function countryName(code = '') {
  if (code === 'EU') return 'European Union';
  try {
    return countryNames.of(code) || code;
  } catch (_error) {
    return code;
  }
}

function normalizedCategory(value = '') {
  const raw = String(value || '').trim().toLowerCase();
  if (raw === 'social_workers' || raw === 'social_worker' || raw === 'social') return 'social_support';
  if (raw === 'child_welfare' || raw === 'cps' || raw === 'safeguarding') return 'child_protection';
  if (raw === 'law_enforcement') return 'police';
  return raw;
}

function fallbackForCountry(code = '') {
  const countryCode = normalizeCountryCode(code) || 'NG';
  const country = countryName(countryCode);
  const reviewed = new Date().toISOString().slice(0, 10);
  return [
    {
      countryCode,
      country,
      category: 'emergency',
      localName: 'National emergency services',
      emergencyNumber: 'Local emergency number - verify before field use',
      phone: '',
      contactType: 'national_emergency',
      sourceName: 'Manual verification required',
      sourceUrl: 'https://childhelplineinternational.org/',
      lastReviewed: reviewed,
      verificationStatus: 'requires_local_verification',
      notes: 'No seed record was found. Add verified emergency, police, and child protection contacts for this country before operational use.',
    },
    {
      countryCode,
      country,
      category: 'police',
      localName: 'Police / law enforcement',
      emergencyNumber: 'Local emergency number - verify before field use',
      phone: '',
      contactType: 'police_or_law_enforcement',
      sourceName: 'Manual verification required',
      sourceUrl: '',
      lastReviewed: reviewed,
      verificationStatus: 'requires_local_verification',
      notes: 'Country terms differ. Add official national/state/local police or law-enforcement contacts.',
    },
    {
      countryCode,
      country,
      category: 'child_protection',
      localName: 'Child protection / social welfare agency',
      emergencyNumber: 'Local emergency number - verify before field use',
      phone: '',
      contactType: 'child_protection_agency',
      sourceName: 'Manual verification required',
      sourceUrl: 'https://childhelplineinternational.org/',
      lastReviewed: reviewed,
      verificationStatus: 'requires_local_verification',
      notes: 'Country terms differ: CPS, child welfare, safeguarding, social services, family services, women/children affairs, or protection agency.',
    },
    {
      countryCode,
      country,
      category: 'social_support',
      localName: 'Social services / protection support agency',
      emergencyNumber: 'Local emergency number - verify before field use',
      phone: '',
      contactType: 'social_support_agency',
      sourceName: 'Manual verification required',
      sourceUrl: '',
      lastReviewed: reviewed,
      verificationStatus: 'requires_local_verification',
      notes: 'Add verified social worker, family support, shelter, or victim support contacts for this country/region.',
    },
  ];
}

function withLabels(item) {
  return {
    ...item,
    categoryLabel: CATEGORY_LABELS[item.category] || item.category,
    country: item.country || countryName(item.countryCode),
  };
}

export function getCountries() {
  const { contacts } = readDirectoryFile();
  const codes = [...new Set(contacts.map((item) => item.countryCode).filter(Boolean))];
  return codes
    .sort((a, b) => countryName(a).localeCompare(countryName(b)))
    .map((code) => ({ code, name: countryName(code) }));
}

export function getCategoryLabels() {
  return CATEGORY_LABELS;
}

export function getDirectoryMeta() {
  const directory = readDirectoryFile();
  return {
    generatedAt: directory.generatedAt,
    warning: directory.warning,
    recordCount: directory.contacts.length,
    countryCount: getCountries().length,
    categories: CATEGORY_LABELS,
  };
}

export function getContacts({ country = '', category = '', q = '', verificationStatus = '' } = {}) {
  const directory = readDirectoryFile();
  const countryCode = normalizeCountryCode(country) || '';
  const categoryName = normalizedCategory(category);
  const search = String(q || '').trim().toLowerCase();
  const verification = String(verificationStatus || '').trim().toLowerCase();

  let results = directory.contacts.filter((item) => {
    const itemCountry = normalizeCountryCode(item.countryCode);
    const countryOk = !countryCode || itemCountry === countryCode || (itemCountry === 'EU' && countryCode === 'EU');
    const categoryOk = !categoryName || item.category === categoryName || (categoryName === 'social_support' && item.category === 'child_protection');
    const verificationOk = !verification || String(item.verificationStatus || '').toLowerCase() === verification;
    const haystack = [item.country, item.countryCode, item.category, item.localName, item.notes, item.phone, item.emergencyNumber, item.sourceName]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    const searchOk = !search || haystack.includes(search);
    return countryOk && categoryOk && verificationOk && searchOk;
  });

  if (!results.length && countryCode) {
    results = fallbackForCountry(countryCode).filter((item) => {
      const categoryOk = !categoryName || item.category === categoryName || (categoryName === 'social_support' && item.category === 'child_protection');
      return categoryOk;
    });
  }

  return results.map(withLabels);
}
