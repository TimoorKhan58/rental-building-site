# City Center — C1 Markaz B-17

Static marketing site (HTML, CSS, vanilla JS). Deploy the folder as static files.

## Tooling

```bash
npm install
npm run validate      # origin, WhatsApp, OG checks + html-validate
npm run generate:media  # SVG placeholders in assets/media/
npm run generate:og     # optional branded og-share.png (site default is og-share.jpg)
```

- **Config:** [`site-config.json`](site-config.json) and [`site-config.js`](site-config.js) — see [`docs/CONFIG.md`](docs/CONFIG.md).
- **Styles:** [`styles.css`](styles.css) imports partials under [`css/`](css/).
- **Media:** [`assets/README.md`](assets/README.md).
