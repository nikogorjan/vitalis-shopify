# Vitalis Shopify theme (aqmoi-home-2)

Store: 0ck7y0-dz.myshopify.com
Live theme: aqmoi-home-2 (#166250414178). Never push to live without asking.

## Content JSON is owned by the theme editor. Do not touch it casually.

Content JSON = `templates/*.json`, `templates/customers/*.json`, `sections/*.json` (header-group,
footer-group), `config/settings_data.json`. These hold the images, text,
section order and settings the customer sets in the Shopify theme editor.

`shopify.theme.toml` ignores these files in the default environment, so plain
`shopify theme dev`, `push` and `pull` never upload or overwrite them. This is
deliberate: on a previous project, local stale copies were uploaded by the
dev server and wiped the customer's images. Keep it that way.

Rules:
- Code work (Liquid, CSS, JS, schema in `sections/*.liquid`, `snippets/`,
  `assets/`) is done normally with `npm run dev` / `npm run push`.
- Never edit a content JSON file from a stale local copy. If a change
  genuinely needs content JSON, do it in a seconds-long window:
  1. `shopify theme pull -e content --development --only templates/index.json --force`
  2. make a targeted edit to that one file
  3. `shopify theme push -e content --development --nodelete --only templates/index.json`
  Tell the user before step 3.
- Prefer changing content in the theme editor UI (or telling the user to)
  over editing content JSON in code.
- `npm run content:pull` snapshots the live editor content into git. Run it
  before committing so git has the real content.
- The local content JSON files in this repo may be STALE. Never trust them as
  the current state of the store; read them only as a reference for structure.

## Going live
- Code: `npm run push:live` (live theme, default env, so content JSON is
  ignored and `--nodelete` keeps remote-only files). Always ask first.
- Content lives in the live theme editor. Since 2026-10-16 the live theme has
  all editor content; edit content there, not in the dev theme editor.
- Before risky live changes, back up: `shopify theme duplicate --theme
  166250414178 --name "aqmoi-home-2 backup <date>" --force`.
- If content was edited in the dev editor, copy it to live per file: pull the
  dev files into a scratch folder, diff against live (check live has no newer
  edits), then `shopify theme push --theme 166250414178 --nodelete
  --allow-live --path <scratch> --only <files>`. Never push
  templates/product.vitalis-preview.json (dev-only preview template).

## Dev theme needs content seeded
Because content JSON is ignored, a fresh development theme has no templates
and `npm run dev` shows a 404. `npm run content:seed-dev` pulls live content
and pushes it to the development theme only (never live). Re-run it to
refresh the dev preview after editor changes on the live theme.

## Visual checks
Dev server runs at http://127.0.0.1:9292. Screenshot via headless Chrome
over the DevTools protocol (plain --screenshot hangs on the dev server).

## Gotcha: Shopify CLI ignore globs
`templates/**/*.json` does NOT match `templates/index.json` in the Shopify CLI
(`**` requires at least one directory). Always list `templates/*.json` and
`templates/customers/*.json` separately. Verify with
`shopify theme push --development --nodelete --verbose` and grep the
"Files to be uploaded" list for content JSON. Set up 2026-10-15.
