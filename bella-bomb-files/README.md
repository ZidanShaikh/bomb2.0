# Bella's Bomb Club

A static website with an interactive world map and animated bomb drops.

## Run

Open `index.html` in your browser. No installation, API keys, or build step required.

## Publish

Push these files to your Git repository. For GitHub Pages, select your branch and the **/ (root)** folder in the repository's Pages settings. Other static hosts can serve the repository root without a build command.

## Files

- `index.html`: the complete website, including styles, scripts, and inline map.
- `assets/world-countries.geojson`: source geography data.
- `scripts/build-world-map.mjs`: regenerates the inline map from the geography data. Run `node scripts/build-world-map.mjs` if you change that data.

The map uses real geography; name placements and effects are simulated. Names and recent drops are stored only in the visitor's browser. Audio is generated in the browser. Fonts load from Google Fonts, with local fallbacks.

Geography: [Natural Earth 1:110m countries](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson), public domain.
