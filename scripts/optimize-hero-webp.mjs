/**
 * Hero responsive WebP: hero-sm.webp 400w, hero-placeholder.webp 683×853; main file under 25 KiB.
 * Also writes hero-placeholder.jpg fallback at 683×853.
 * Source: assets/media/hero-placeholder.jpg, or if missing, existing hero-placeholder.webp
 * Run: node scripts/optimize-hero-webp.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const jpgPath = path.join(root, 'assets', 'media', 'hero-placeholder.jpg');
const webpInPath = path.join(root, 'assets', 'media', 'hero-placeholder.webp');
const outDir = path.join(root, 'assets', 'media');

const sourcePath = fs.existsSync(jpgPath) ? jpgPath : webpInPath;
if (!fs.existsSync(sourcePath)) {
  console.error('Missing source image. Need hero-placeholder.jpg or hero-placeholder.webp in assets/media/');
  process.exit(1);
}

const W683 = 683;
const H853 = 853;
const W400 = 400;
const H500 = 500;
/* Mobile LCP: displayed ~390×488 in audits */
const W390 = 390;
const H488 = 488;

const base = sharp(sourcePath).rotate().resize(W683, H853, { fit: 'cover', position: 'attention' });

let quality = 80;
let buf683;
for (let i = 0; i < 16; i++) {
  buf683 = await base.clone().webp({ quality, effort: 6, smartSubsample: true }).toBuffer();
  if (buf683.length <= 25 * 1024) break;
  quality -= 4;
}
if (buf683.length > 25 * 1024) {
  for (let q = quality; q >= 45; q -= 3) {
    buf683 = await base.clone().webp({ quality: q, effort: 6, smartSubsample: true }).toBuffer();
    if (buf683.length <= 25 * 1024) break;
  }
}

const out683 = path.join(outDir, 'hero-placeholder.webp');
fs.writeFileSync(out683, buf683);

const buf400 = await sharp(sourcePath)
  .rotate()
  .resize(W400, H500, { fit: 'cover', position: 'attention' })
  .webp({ quality: Math.max(70, quality - 4), effort: 6, smartSubsample: true })
  .toBuffer();
const out400 = path.join(outDir, 'hero-sm.webp');
fs.writeFileSync(out400, buf400);

const buf390 = await sharp(sourcePath)
  .rotate()
  .resize(W390, H488, { fit: 'cover', position: 'attention' })
  .webp({ quality: Math.max(70, quality - 4), effort: 6, smartSubsample: true })
  .toBuffer();
const out390 = path.join(outDir, 'hero-390.webp');
fs.writeFileSync(out390, buf390);

const jpgBuf = await sharp(buf683)
  .jpeg({ quality: 80, mozjpeg: true, chromaSubsampling: '4:2:0' })
  .toBuffer();
const jpgOut = path.join(outDir, 'hero-placeholder.jpg');
const tmpJpg = path.join(outDir, '._hero-jpg-temp');
try {
  if (fs.existsSync(jpgOut)) fs.rmSync(jpgOut);
} catch (e) {
  /* try overwrite via temp + rename */
}
fs.writeFileSync(tmpJpg, jpgBuf);
fs.renameSync(tmpJpg, jpgOut);

const m683 = await sharp(buf683).metadata();
const m400 = await sharp(buf400).metadata();
const m390 = await sharp(buf390).metadata();
console.log('Wrote', path.relative(root, out683), `${(buf683.length / 1024).toFixed(1)} KiB`, `${m683.width}x${m683.height}`);
console.log('Wrote', path.relative(root, out400), `${(buf400.length / 1024).toFixed(1)} KiB`, `${m400.width}x${m400.height}`);
console.log('Wrote', path.relative(root, out390), `${(buf390.length / 1024).toFixed(1)} KiB`, `${m390.width}x${m390.height}`);
console.log('Wrote', path.relative(root, jpgOut), `${(jpgBuf.length / 1024).toFixed(1)} KiB`);
