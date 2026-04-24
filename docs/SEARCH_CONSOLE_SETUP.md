# Google Search Console — setup & monitoring

Use this checklist after deploying `https://citycenter-c1markaz-b17.pk/` (or your production domain).

## 1. Verify property

1. Go to [Google Search Console](https://search.google.com/search-console).
2. Add a **URL prefix** property: `https://citycenter-c1markaz-b17.pk/`
3. Verify using one of:
   - **HTML file upload** (place the file in site root), or
   - **DNS TXT record** (if you control DNS), or
   - **Google Analytics / Tag Manager** (if already installed).

## 2. Submit sitemap

1. In Search Console: **Sitemaps** → add: `https://citycenter-c1markaz-b17.pk/sitemap.xml`
2. Ensure [`robots.txt`](../robots.txt) at the root references the same sitemap URL (already configured).

## 3. Request indexing for new pages

After launch or major updates:

1. **URL Inspection** → enter each important URL (home, flats, shops, offices, location, guide).
2. Click **Request indexing** for pages that show “URL is not on Google”.

Important URLs:

| Page | URL |
|------|-----|
| Home | `/` |
| Flats | `/flats-for-rent-b17-islamabad/` |
| Shops | `/shops-for-rent-c1-markaz-b17/` |
| Offices | `/offices-for-rent-b17-islamabad/` |
| Location | `/location/c1-markaz-b17-islamabad/` |
| Area guide | `/c1-markaz-b17-renting-guide/` |

## 4. Monitor target queries (weekly)

In **Performance** → filter by **Query** and watch terms such as:

- `flats for rent b-17`
- `shops for rent c1 markaz`
- `offices for rent b-17 islamabad`
- `city center b-17`
- `c1 markaz b-17 rent`

Track **impressions**, **clicks**, **average position**, and **CTR**.

## 5. Lead tracking (optional)

- Use WhatsApp Business **click-to-chat** analytics or UTM parameters on marketing links, e.g.  
  `?utm_source=google&utm_medium=organic` (append to landing URLs used in ads only; organic can stay clean).
- For stricter conversion tracking, consider a lightweight form backend or call tracking—outside the scope of this static site.

## 6. When inventory or prices change

1. Update visible `<time datetime="...">` dates on listing sections.
2. Update `lastmod` in [`sitemap.xml`](../sitemap.xml) for changed URLs.
3. Request re-indexing in Search Console for those URLs.

## 7. Google Business Profile (recommended)

If you manage a **Google Business Profile** for the building or leasing office:

- Add the **website** URL and **same phone** as on the site (`+92 330 9089380`).
- Add **service areas**: Islamabad, B-17.
- Upload **real photos** of the building and units (aligns with on-site SEO).

Add the GBP public URL to Organization `sameAs` in [`index.html`](../index.html) when available.
