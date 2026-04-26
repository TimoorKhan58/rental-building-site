# City Center — C1 Markaz B-17

Static marketing site (HTML, CSS, vanilla JS). Deploy the folder as static files.

## Tooling

```bash
npm install
npm run validate      # origin, WhatsApp, OG checks + html-validate
npm run generate:media  # SVG placeholders in assets/media/
npm run generate:og     # optional branded og-share.png (site default is og-share.jpg)
npm run build:analytics # rebuild vendor/vercel-analytics.js after upgrading @vercel/analytics
```

- **Config:** [`site-config.json`](site-config.json) and [`site-config.js`](site-config.js) — see [`docs/CONFIG.md`](docs/CONFIG.md).
- **Styles:** [`styles.css`](styles.css) imports partials under [`css/`](css/).
- **Media:** [`assets/README.md`](assets/README.md).

## Vercel Web Analytics

Pages load [`vendor/vercel-analytics.js`](vendor/vercel-analytics.js), built from [`scripts/analytics-entry.mjs`](scripts/analytics-entry.mjs) via `npm run build:analytics`. In the Vercel project dashboard, enable **Web Analytics** (Project → Analytics), deploy, then browse the site; events usually appear within ~30 seconds.
