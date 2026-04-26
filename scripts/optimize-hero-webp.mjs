/**
 * Writes assets/media/hero-placeholder.webp under 50 KiB for PageSpeed.
 * Run: node scripts/optimize-hero-webp.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const jpgPath = path.join(root, 'assets', 'media', 'hero-placeholder.jpg');
const webpPath = path.join(root, 'assets', 'media', 'hero-placeholder.webp');

if (!fs.existsSync(jpgPath)) {
  console.error('Missing:', jpgPath);
  process.exit(1);
}

const meta = await sharp(jpgPath).metadata();
const maxW = 900;
let pipeline = sharp(jpgPath).rotate();
if (meta.width && meta.width > maxW) {
  pipeline = pipeline.resize(maxW, null, { withoutEnlargement: true, fit: 'inside' });
}

let quality = 82;
let buf;
for (let i = 0; i < 12; i++) {
  buf = await pipeline.clone().webp({ quality, effort: 6 }).toBuffer();
  if (buf.length <= 50 * 1024) break;
  quality -= 6;
}
if (buf.length > 50 * 1024) {
  let w = maxW;
  while (buf.length > 50 * 1024 && w >= 480) {
    w -= 80;
    buf = await sharp(jpgPath)
      .rotate()
      .resize(w, null, { withoutEnlargement: true, fit: 'inside' })
      .webp({ quality: 78, effort: 6 })
      .toBuffer();
  }
}

fs.writeFileSync(webpPath, buf);
const outMeta = await sharp(buf).metadata();
console.log('Wrote', path.relative(root, webpPath), `${(buf.length / 1024).toFixed(1)} KiB`, `${outMeta.width}x${outMeta.height}`);
