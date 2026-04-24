# Site configuration

Business constants live in **`site-config.json`** (source of truth for tooling) and **`site-config.js`** (exposed to the browser as `window.__SITE__`).

## When you change domain or phone

1. Edit **`site-config.json`**: `origin`, and the **`phones`** array. Each entry can have:
   - **`label`**: short line above the number (e.g. `Reception` or `Leasing (WhatsApp)`).
   - **`phoneDisplay`**: human-readable number (e.g. `+92 330 9089380`).
   - **`phoneTel`**: `tel:` link (E.164 such as `+923309089380`).
   - **`whatsappE164`**: digits only, no `+` (e.g. `923309089380`) for WhatsApp deep links. Add more `phones` objects for additional numbers; the **first** entry is the default for site-wide `wa.me` links and the inquiry form.
2. Edit **`site-config.js`** to match the same `phones` list (kept in sync manually).
3. Update **`index.html`**: JSON-LD `telephone` (and `contactPoint` if needed), noscript `tel` fallback, plus subpages: canonical URLs, `og:url`, JSON-LD `@id` / `url` fields, and any hardcoded `tel:` / `wa.me` links.
4. Update **`sitemap.xml`**, **`robots.txt`**, and this doc if URLs change.
5. Run **`npm run validate`** to catch mismatches.

`main.js` reads WhatsApp base URL from `window.__SITE__.whatsappUrl` when `site-config.js` loads first.

## Media

- **`assets/og-share.jpg`** — social share image (replace with your photo; optional legacy `og-share.png` via `npm run generate:og`).
- **`assets/media/*.svg`** — placeholders; replace with real JPEG/WebP and update HTML `src` / `alt` (see `assets/README.md`).
