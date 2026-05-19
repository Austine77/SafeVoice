import fs from 'fs';
import path from 'path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const copyNames = ['index.html', 'staff.html', 'team.html', 'police-contact.html', 'social-worker-contact.html'];

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const name of copyNames) {
  const source = path.join(root, name);
  if (fs.existsSync(source)) fs.copyFileSync(source, path.join(dist, name));
}

for (const dir of ['assets', 'images']) {
  const source = path.join(root, dir);
  if (fs.existsSync(source)) fs.cpSync(source, path.join(dist, dir), { recursive: true });
}

console.log('SafeVoice worldwide static build created in dist/');
