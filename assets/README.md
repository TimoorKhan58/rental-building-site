# City Center media assets

All imagery is **hosted locally** (no stock CDN) for performance and trust. Replace placeholders with **your own photos** when available.

## Key files

| File | Use |
|------|-----|
| `og-share.jpg` | Open Graph / Twitter share image (1200×630, high-quality placeholder). **Replace with your building photo** (same path or update meta URLs). |
| `media/hero-placeholder.jpg` | Homepage hero image — **replace with your City Center shot** (keep filename or change `index.html`). |
| `media/gallery-exterior.jpg` | Gallery lead image — optional swap for a real exterior. |
| `site-icon.svg` | Favicon |
| `media/shop-rent-1.jpg`, `shop-rent-2.jpg` | **Shops** listing page gallery — replace with your retail photos. |
| `media/flat-rent-1br-a.jpg` … `flat-rent-3br-b.jpg` | **Flats** page (1/2/3 bed) — six files; swap for real unit shots. |
| `media/office-rent-a.jpg`, `office-rent-b.jpg` | **Offices** page gallery — replace with your workspace photos. |
| `media/*.svg` | Fallback placeholders (e.g. homepage unit cards) — optional swap for `.jpg` / `.webp`. |
| `og-share.png` | Legacy branded PNG from `npm run generate:og` — optional; site uses `og-share.jpg` by default. |

## Generating placeholders

From the project root:

```bash
npm run generate:media   # SVG placeholders in media/
npm run generate:og      # raster share image (PowerShell)
```

## Production photos

| Suggested file | Use |
|----------------|-----|
| `building-exterior.jpg` | Homepage hero, gallery, OG image |
| `shop-unit-01.jpg` … | Shop listings |
| `flat-1bed-01.jpg` … | 1-bed flats |
| `flat-2bed-01.jpg` … | 2-bed flats |
| `flat-3bed-01.jpg` … | 3-bed flats |
| `office-unit-01.jpg` … | Offices |

## Guidelines

- **Resolution:** at least 1200px wide for hero/gallery; 800px+ for unit cards.
- **Compression:** WebP or optimized JPEG (e.g. 80–85% quality).
- **Alt text:** describe the real unit or view (e.g. “1-bed flat living room, City Center B-17”).
- **Privacy:** do not upload tenant faces or ID documents.
- **Social share:** after replacing `og-share.jpg`, keep `og:image` meta URLs pointed at `https://your-domain/assets/og-share.jpg` (see `site-config.json` / `docs/CONFIG.md`).
