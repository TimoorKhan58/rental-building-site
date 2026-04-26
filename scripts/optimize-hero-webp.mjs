/**
 * Hero responsive WebP: 390/600/683/780 w descriptors + jpg@683, hero-sm 400w.
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
const W390 = 390;
const H488 = 488;
const W600 = 600;
const H750 = 750;
const W780 = 780;
const H975 = 975;

const base = sharp(sourcePath).rotate().resize(W683, H853, { fit: 'cover', position: 'attention' });

let quality = 80;
let buf683;
for (let i = 0; i < 16; i++) {
  buf683 = await base.clone().webp({ quality, effort: 6, smartSubsample: true }).toBuffer();
  if (buf683.length <= 20 * 1024) break;
  quality -= 3;
}
if (buf683.length > 20 * 1024) {
  for (let q = quality; q >= 42; q -= 2) {
    buf683 = await base.clone().webp({ quality: q, effort: 6, smartSubsample: true }).toBuffer();
    if (buf683.length <= 20 * 1024) break;
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

const qSide = Math.max(68, quality - 4);
const buf390 = await sharp(sourcePath)
  .rotate()
  .resize(W390, H488, { fit: 'cover', position: 'attention' })
  .webp({ quality: qSide, effort: 6, smartSubsample: true })
  .toBuffer();
const out390 = path.join(outDir, 'hero-390.webp');
fs.writeFileSync(out390, buf390);

const buf600 = await sharp(sourcePath)
  .rotate()
  .resize(W600, H750, { fit: 'cover', position: 'attention' })
  .webp({ quality: qSide, effort: 6, smartSubsample: true })
  .toBuffer();
const out600 = path.join(outDir, 'hero-600.webp');
fs.writeFileSync(out600, buf600);

const buf780 = await sharp(sourcePath)
  .rotate()
  .resize(W780, H975, { fit: 'cover', position: 'attention' })
  .webp({ quality: qSide, effort: 6, smartSubsample: true })
  .toBuffer();
const out780 = path.join(outDir, 'hero-780.webp');
fs.writeFileSync(out780, buf780);

const jpgBuf = await sharp(buf683)
  .jpeg({ quality: 80, mozjpeg: true, chromaSubsampling: '4:2:0' })
  .toBuffer();
const jpgOut = path.join(outDir, 'hero-placeholder.jpg');
const tmpJpg = path.join(outDir, '._hero-jpg-temp');
try {
  if (fs.existsSync(jpgOut)) fs.rmSync(jpgOut);
} catch (e) {
  /* */
}
fs.writeFileSync(tmpJpg, jpgBuf);
fs.renameSync(tmpJpg, jpgOut);

const m683 = await sharp(buf683).metadata();
const m400 = await sharp(buf400).metadata();
const m390 = await sharp(buf390).metadata();
const m600 = await sharp(buf600).metadata();
const m780 = await sharp(buf780).metadata();
console.log('Wrote', path.relative(root, out683), `${(buf683.length / 1024).toFixed(1)} KiB`, `${m683.width}x${m683.height}`);
console.log('Wrote', path.relative(root, out400), `${(buf400.length / 1024).toFixed(1)} KiB`, `${m400.width}x${m400.height}`);
console.log('Wrote', path.relative(root, out390), `${(buf390.length / 1024).toFixed(1)} KiB`, `${m390.width}x${m390.height}`);
console.log('Wrote', path.relative(root, out600), `${(buf600.length / 1024).toFixed(1)} KiB`, `${m600.width}x${m600.height}`);
console.log('Wrote', path.relative(root, out780), `${(buf780.length / 1024).toFixed(1)} KiB`, `${m780.width}x${m780.height}`);
console.log('Wrote', path.relative(root, jpgOut), `${(jpgBuf.length / 1024).toFixed(1)} KiB`);
