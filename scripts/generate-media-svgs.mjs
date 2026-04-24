/**
 * Generates locally hosted placeholder SVGs (replace with real photos in production).
 * Run: node scripts/generate-media-svgs.mjs
 */
import { mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'assets', 'media');
mkdirSync(outDir, { recursive: true });

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function svgCard(id, w, h, title, subtitle) {
  const gid = `g-${id}`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img">
  <title>${esc(title)}</title>
  <defs>
    <linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1a2332"/>
      <stop offset="100%" stop-color="#2d4a6f"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#${gid})"/>
  <rect x="0" y="${h - 8}" width="100%" height="8" fill="#8b7355" opacity="0.4"/>
  <text x="50%" y="${Math.round(h / 2 - 12)}" text-anchor="middle" fill="#fffcf9" font-family="system-ui,Segoe UI,sans-serif" font-size="20" font-weight="600">${esc(title)}</text>
  <text x="50%" y="${Math.round(h / 2 + 22)}" text-anchor="middle" fill="#e6e9ef" font-family="system-ui,Segoe UI,sans-serif" font-size="12" opacity="0.9">${esc(subtitle)}</text>
</svg>`;
}

const specs = [
  ['hero-visual.svg', 400, 500, 'City Center', 'C1 Markaz · Street 41 · B-17'],
  ['shop-1.svg', 640, 400, 'Shop space', 'Placeholder — request photos on WhatsApp'],
  ['shop-2.svg', 640, 400, 'Retail frontage', 'Placeholder — request photos on WhatsApp'],
  ['shop-3.svg', 640, 400, 'Markaz retail', 'Placeholder — request photos on WhatsApp'],
  ['flat-1b-1.svg', 640, 400, '1-bed flat', 'Placeholder — request photos on WhatsApp'],
  ['flat-1b-2.svg', 640, 400, '1-bed living', 'Placeholder — request photos on WhatsApp'],
  ['flat-1b-3.svg', 640, 400, '1-bed kitchen', 'Placeholder — request photos on WhatsApp'],
  ['flat-2b-1.svg', 640, 400, '2-bed flat', 'Placeholder — request photos on WhatsApp'],
  ['flat-2b-2.svg', 640, 400, '2-bed lounge', 'Placeholder — request photos on WhatsApp'],
  ['flat-2b-3.svg', 640, 400, '2-bed bedroom', 'Placeholder — request photos on WhatsApp'],
  ['flat-3b-1.svg', 640, 400, '3-bed flat', 'Placeholder — request photos on WhatsApp'],
  ['flat-3b-2.svg', 640, 400, '3-bed lounge', 'Placeholder — request photos on WhatsApp'],
  ['flat-3b-3.svg', 640, 400, '3-bed dining', 'Placeholder — request photos on WhatsApp'],
  ['office-1.svg', 640, 400, 'Office suite', 'Placeholder — request photos on WhatsApp'],
  ['office-2.svg', 640, 400, 'Workspace', 'Placeholder — request photos on WhatsApp'],
  ['office-3.svg', 640, 400, 'Professional office', 'Placeholder — request photos on WhatsApp'],
  ['gallery-exterior.svg', 800, 520, 'Building exterior', 'Placeholder — request photos on WhatsApp'],
  ['gallery-lobby.svg', 800, 600, 'Lobby & circulation', 'Placeholder — request photos on WhatsApp'],
  ['gallery-residential.svg', 800, 600, 'Residential finish', 'Placeholder — request photos on WhatsApp'],
  ['gallery-retail.svg', 800, 600, 'Retail / services', 'Placeholder — request photos on WhatsApp'],
  ['gallery-workspace.svg', 800, 600, 'Workspace', 'Placeholder — request photos on WhatsApp']
];

let i = 0;
for (const [name, w, h, t, s] of specs) {
  writeFileSync(join(outDir, name), svgCard(`m${i++}`, w, h, t, s), 'utf8');
}

console.log(`Wrote ${specs.length} SVGs to ${outDir}`);
