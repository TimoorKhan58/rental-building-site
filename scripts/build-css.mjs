/**
 * Concatenate css/*.css into a single styles.css (one network request, no @import).
 * Run: node scripts/build-css.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const parts = [
  '01-tokens-base.css',
  '02-announcement.css',
  '03-header-nav.css',
  '04-buttons-fab-reveal.css',
  '05-hero.css',
  '06-sections-highlights.css',
  '07-units.css',
  '08-why-gallery-reviews.css',
  '09-viewing-location.css',
  '10-contact-faq-footer.css',
  '11-hub-seo.css',
  '12-pathways-filters.css',
  '13-mobile-responsive.css',
];

let out =
  '/* City Center — bundled from css/*.css; run: npm run build:css */\n\n';
for (const f of parts) {
  const p = path.join(root, 'css', f);
  out += `/* === ${f} === */\n`;
  out += fs.readFileSync(p, 'utf8').trimEnd();
  out += '\n\n';
}
fs.writeFileSync(path.join(root, 'styles.css'), out.trimEnd() + '\n');
console.log('Wrote styles.css (' + parts.length + ' partials)');
