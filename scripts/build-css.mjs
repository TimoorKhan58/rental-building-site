/**
 * Concatenate css/*.css → minified styles.css (one network request).
 * Inlines critical CSS (01–05) into index.html <style id="cc-critical-hero">.
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

const criticalParts = [
  '01-tokens-base.css',
  '02-announcement.css',
  '03-header-nav.css',
  '04-buttons-fab-reveal.css',
  '05-hero.css',
];

function minifyCSS(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

let out = '';
for (const f of parts) {
  const p = path.join(root, 'css', f);
  out += fs.readFileSync(p, 'utf8').trimEnd();
  out += '\n\n';
}

const minified = minifyCSS(out);
fs.writeFileSync(path.join(root, 'styles.css'), minified + '\n');
console.log('Wrote styles.css (minified, ' + parts.length + ' partials)');

let criticalRaw = '';
for (const f of criticalParts) {
  const p = path.join(root, 'css', f);
  criticalRaw += fs.readFileSync(p, 'utf8').trimEnd();
  criticalRaw += '\n\n';
}
const criticalMin = minifyCSS(criticalRaw);

const indexPath = path.join(root, 'index.html');
const indexHtml = fs.readFileSync(indexPath, 'utf8');
const replaced = indexHtml.replace(
  /(<style[^>]*\bid=["']cc-critical-hero["'][^>]*>)([\s\S]*?)(<\/style>)/i,
  '$1' + criticalMin + '$3'
);
if (replaced === indexHtml) {
  console.warn('Warning: no <style id="cc-critical-hero"> in index.html — critical CSS not injected.');
} else {
  fs.writeFileSync(indexPath, replaced, 'utf8');
  console.log('Injected critical CSS into index.html (' + criticalMin.length + ' chars)');
}
