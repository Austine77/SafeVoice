import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, '..', 'data');
const dataFile = path.join(dataDir, 'safevoice-db.json');

function defaultDb() {
  return { cases: [], users: [], accessLogs: [] };
}

export function isFileDbEnabled() {
  return String(process.env.USE_FILE_DB || 'false').toLowerCase() === 'true';
}

export async function readDb() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    const raw = await fs.readFile(dataFile, 'utf8');
    return { ...defaultDb(), ...JSON.parse(raw) };
  } catch {
    const initial = defaultDb();
    await writeDb(initial);
    return initial;
  }
}

export async function writeDb(db) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(db, null, 2));
}

export function generateCaseId() {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `SV-${y}${m}${d}-${random}`;
}
