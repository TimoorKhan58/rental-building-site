/**
 * One-time splitter: reads ../styles.css and writes ../css/*.css partials.
 * Run from repo root: node scripts/split-css.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const srcPath = join(root, 'styles.css');
const outDir = join(root, 'css');
mkdirSync(outDir, { recursive: true });

const raw = readFileSync(srcPath, 'utf8');
const firstMeaningful = raw
  .split(/\r?\n/)
  .map((l) => l.trim())
  .find((l) => l && !l.startsWith('/*') && !l.startsWith('*') && l !== '*/');
if (firstMeaningful && firstMeaningful.startsWith('@import')) {
  console.error(
    'styles.css is the composed @import entry file. Restore a monolithic backup before running this splitter, or edit css/*.css directly.'
  );
  process.exit(1);
}

const lines = raw.split(/\r?\n/);

function slice(start, end) {
  return lines.slice(start - 1, end).join('\n') + '\n';
}

const chunks = [
  ['01-tokens-base.css', 1, 162],
  ['02-announcement.css', 163, 231],
  ['03-header-nav.css', 232, 449],
  ['04-buttons-fab-reveal.css', 450, 580],
  ['05-hero.css', 581, 856],
  ['06-sections-highlights.css', 857, 961],
  ['07-units.css', 962, 1227],
  ['08-why-gallery-reviews.css', 1228, 1473],
  ['09-viewing-location.css', 1474, 1703],
  ['10-contact-faq-footer.css', 1704, 2130],
  ['11-hub-seo.css', 2131, lines.length]
];

for (const [name, a, b] of chunks) {
  writeFileSync(join(outDir, name), slice(a, b), 'utf8');
  console.log('Wrote', name, `(${a}-${b})`);
}
