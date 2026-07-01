# Production migration note

Date: 2026-06-29

## Current public structure

Updated: 2026-07-01

The production-facing entry point is now the root top page:

- `/`
- `index.html`

The newer RevoFunding pages are published at the root level:

- `list.html`
- `spark.html`
- `sparkers.html`
- `boost.html`
- `boosters.html`
- `revo-art.html`
- `revo-art-list.html`
- `certified-artists.html`
- `site-map.html`

Shared files remain under:

- `components/`
- `data/`
- `tokens/`

The earlier redirect plan has been superseded. The root page is used as the main production top, and `/list.html` is treated as the participation entry page.

The detailed production migration design is recorded in:

- `docs/production-site-map-migration-design-2026-07-01.md`

## Legacy record

The previous root public pages were copied as an internal record to:

- `docs/legacy-public-pages-2026-06-29/`

## Redirected legacy URLs

The following old root URLs now guide visitors to the newer structure:

- `supporters.html` -> `/spark.html`
- `shop.html` -> `/boost.html`
- `challenger.html` -> `/spark.html`
- `concept.html` -> `/revolist.html`
- `designers.html` -> `/certified-artists.html`
- `revo-art.html` -> replaced by the newer Revo Art page at the same root URL
- `achieved.html` -> `/list.html`
- `project-revo-art.html` -> `/revo-art.html`
- `project-revolink.html` -> `/list.html`
- `project-bousai.html` -> `/list.html`

## Upload folder

`02_GITHUB_UPLOAD/` is the production upload package.

Because the production domain is already `https://revofunding.onokun.com/`, the public package places the newer HTML pages directly at the root level.

Shared app files remain under:

- `components/`
- `data/`
- `tokens/`
- `assets/`

Do not publish the newer pages as `/revofunding/...`. Public URLs should use `/...`.
