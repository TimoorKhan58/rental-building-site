# Stylesheet partials

`styles.css` in the project root imports these files in order. Edit the relevant partial instead of a single huge file.

- `01-tokens-base.css` — design tokens, reset, typography, layout primitives
- `02-announcement.css` — top announcement bar
- `03-header-nav.css` — header, navigation, mobile menu
- `04-buttons-fab-reveal.css` — buttons, WhatsApp FAB, scroll reveal
- `05-hero.css` — hero section
- `06-sections-highlights.css` — generic sections, highlights grid
- `07-units.css` — inventory / unit cards
- `08-why-gallery-reviews.css` — why us, gallery, reviews
- `09-viewing-location.css` — process steps, location / map
- `10-contact-faq-footer.css` — contact, inquiry form, FAQ, footer
- `11-hub-seo.css` — hub pages, breadcrumbs, listing meta, utilities

To split a **monolithic** `styles.css` into these files again, temporarily replace root `styles.css` with the full CSS (not the `@import` stub), then run `node scripts/split-css.mjs`. The script refuses to run if `styles.css` is already the composed import file.
