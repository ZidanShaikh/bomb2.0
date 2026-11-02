import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const geography = JSON.parse(fs.readFileSync(path.join(root, 'assets/world-countries.geojson'), 'utf8'));
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const coordinate = ([lon, lat]) => [((lon + 180) / 360 * 1000).toFixed(1), ((90 - lat) / 180 * 500).toFixed(1)];
const colors = { 'North America': '#82916b', 'South America': '#879a70', Europe: '#a2ad80', Africa: '#a7a178', Asia: '#8c9a75', Oceania: '#a3aa7b', Antarctica: '#9bab9f' };
const countries = geography.features.map(feature => {
  const polygons = feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates] : feature.geometry.coordinates;
  const d = polygons.map(polygon => polygon.map(ring => {
    const points = ring.map(coordinate).map(p => p.join(' '));
    return 'M' + points.filter((p, i) => i === 0 || p !== points[i - 1]).join('L') + 'Z';
  }).join('')).join('');
  const name = escape(feature.properties.NAME_LONG || feature.properties.NAME);
  return `<path d="${d}" fill="${colors[feature.properties.CONTINENT] || '#8c9a75'}" data-country="${name}" fill-rule="evenodd"><title>${name}</title></path>`;
}).join('\n');
const labels = [
  [215, 144, 'NORTH AMERICA'], [335, 330, 'SOUTH AMERICA'], [535, 111, 'EUROPE'],
  [547, 255, 'AFRICA'], [725, 160, 'ASIA'], [881, 355, 'OCEANIA'], [500, 467, 'ANTARCTICA']
].map(([x, y, text]) => `<text x="${x}" y="${y}">${text}</text>`).join('');
const svg = `<svg class="map-art" id="map-art" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
<defs><pattern id="world-grid" width="83.3333" height="83.3333" patternUnits="userSpaceOnUse"><path d="M83.3333 0H0v83.3333" fill="none" stroke="#789589" stroke-width=".6" opacity=".25"/></pattern><radialGradient id="world-ocean"><stop stop-color="#344f47"/><stop offset="1" stop-color="#1f3532"/></radialGradient></defs>
<rect x="0" y="0" width="1000" height="500" fill="url(#world-ocean)"/>
<rect x="0" y="0" width="1000" height="500" fill="url(#world-grid)"/>
<path d="M0 250H1000" stroke="#a5b597" stroke-width=".8" stroke-dasharray="4 5" opacity=".4"/>
<g id="world-countries" stroke="#364b3c" stroke-width=".65" stroke-linejoin="round">${countries}</g>
<g class="continent-labels" font-family="'Space Mono',monospace" font-size="10" font-weight="700" letter-spacing="1.8" fill="#e0e3c6" text-anchor="middle" pointer-events="none">${labels}</g>
<g class="ocean-labels" font-family="'Space Mono',monospace" font-size="8" letter-spacing="2" fill="#a6bcb2" opacity=".55" text-anchor="middle" pointer-events="none"><text x="85" y="285">PACIFIC OCEAN</text><text x="433" y="257" transform="rotate(-65 433 257)">ATLANTIC OCEAN</text><text x="705" y="338">INDIAN OCEAN</text><text x="956" y="254" transform="rotate(-90 956 254)">PACIFIC OCEAN</text><text x="500" y="42">ARCTIC OCEAN</text></g>
</svg>`;
const indexPath = path.join(root, 'index.html');
const html = fs.readFileSync(indexPath, 'utf8');
if (!/<svg class="map-art"[\s\S]*?<\/svg>/.test(html)) throw new Error('Map SVG was not found');
fs.writeFileSync(indexPath, html.replace(/<svg class="map-art"[\s\S]*?<\/svg>/, svg));
console.log(`Embedded ${geography.features.length} country shapes in the standalone page.`);
