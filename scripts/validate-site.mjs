/**
 * Lightweight checks: site-config.json vs HTML (origin, WhatsApp, OG image).
 * Plus html-validate on all HTML files when the package is installed.
 */
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const cfgPath = join(root, 'site-config.json');

if (!existsSync(cfgPath)) {
  console.error('Missing site-config.json');
  process.exit(1);
}

const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'));
const origin = cfg.origin.replace(/\/$/, '');
const primaryE164 =
  (Array.isArray(cfg.phones) && cfg.phones[0] && cfg.phones[0].whatsappE164) || cfg.whatsappE164;
if (!primaryE164) {
  console.error('site-config.json: set phones[0].whatsappE164 (or legacy whatsappE164)');
  process.exit(1);
}
const waPath = '/wa.me/' + primaryE164;
const ogSuffix = (cfg.ogImagePath || '/assets/og-share.jpg').replace(/^\//, '');

function walkHtml(dir, acc = []) {
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === 'node_modules' || ent.name === '.git') continue;
    const p = join(dir, ent.name);
    if (ent.isDirectory()) walkHtml(p, acc);
    else if (ent.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

const htmlFiles = walkHtml(root);
let errors = 0;

for (const file of htmlFiles) {
  const rel = file.replace(root + '\\', '').replace(root + '/', '');
  const text = readFileSync(file, 'utf8');
  if (!text.includes(origin)) {
    console.error(`[${rel}] expected origin ${origin} in file`);
    errors++;
  }
  if (!text.includes(waPath)) {
    console.error(`[${rel}] expected WhatsApp link ${waPath}`);
    errors++;
  }
  if (!text.includes(ogSuffix) && !text.includes('og-share')) {
    console.error(`[${rel}] expected local OG asset reference`);
    errors++;
  }
}

let htmlValidateFailed = false;
try {
  const { HtmlValidate } = await import('html-validate');
  const hv = new HtmlValidate({
    extends: ['html-validate:recommended'],
    rules: {
      'void-style': 'off',
      'prefer-native-element': 'off',
      'no-unknown-elements': 'off',
      'empty-title': 'off',
      'element-name': 'off',
      'hidden-focusable': 'off',
      'no-inline-style': 'off',
      'no-raw-characters': 'off',
      'long-title': 'off',
      'aria-label-misuse': 'off',
      'tel-non-breaking': 'off'
    }
  });
  for (const file of htmlFiles) {
    const src = readFileSync(file, 'utf8');
    const report = await hv.validateString(src, file);
    if (!report.valid) {
      htmlValidateFailed = true;
      for (const res of report.results) {
        for (const msg of res.messages || []) {
          console.error(
            `${res.filePath}:${msg.line}:${msg.column} [${msg.ruleId}] ${msg.message}`
          );
        }
      }
    }
  }
} catch (e) {
  if (e && e.code === 'ERR_MODULE_NOT_FOUND') {
    console.warn('html-validate not installed; run npm install for full markup checks.');
  } else {
    throw e;
  }
}

if (errors > 0) {
  console.error(`\nConfig consistency: ${errors} issue(s).`);
  process.exit(1);
}

if (htmlValidateFailed) {
  console.error('\nhtml-validate reported issues.');
  process.exit(1);
}

console.log(`OK: ${htmlFiles.length} HTML file(s), origin & WhatsApp checks passed.`);
