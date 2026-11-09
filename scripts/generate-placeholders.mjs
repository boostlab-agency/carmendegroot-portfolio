// Generates abstract, on-brand placeholder visuals for the demo projects.
// Usage: npm run placeholders  → writes /public/placeholders/{slug}-{1..3}.svg
// Replace them anytime by uploading real images in the CMS.
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "public", "placeholders");
fs.mkdirSync(OUT, { recursive: true });

const LIME = "#CED82E";
const INK = "#111110";
const PAPER = "#F6F5F0";

const projects = [
  { slug: "aanvalswijzer", title: "Aanvalswijzer", bg: "#24402C", fg: PAPER, soft: "#3B5B43", warm: "#E9E4D6" },
  { slug: "ruimte-voor-wie-je-bent", title: "Ruimte voor wie je bent", bg: "#E7DDD3", fg: INK, soft: "#D3C3B4", warm: "#B06C40" },
  { slug: "de-groeiboom", title: "De Groeiboom", bg: "#C98A4B", fg: INK, soft: "#B57438", warm: "#24402C" },
  { slug: "ontwerpen-voor-zelfstandigheid", title: "Ontwerpen voor zelfstandigheid", bg: "#2B2B29", fg: PAPER, soft: "#3E3D3A", warm: "#C98A4B" },
  { slug: "de-kleur-van-talent", title: "De Kleur van Talent", bg: "#EDEBE2", fg: INK, soft: "#DAD7CB", warm: "#24402C" },
  { slug: "signalen-van-morgen", title: "Signalen van Morgen", bg: "#B9C1B0", fg: INK, soft: "#A3AC98", warm: "#111110" },
];

const W = 1600;
const H = 1200;

const defs = `
  <defs>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" result="n"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="table" tableValues="0 0.10"/></feComponentTransfer>
      <feBlend in2="SourceGraphic" mode="multiply"/>
    </filter>
  </defs>`;

const label = (p, n, kind) => `
  <g font-family="ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif" fill="${p.fg}">
    <text x="72" y="${H - 72}" font-size="30" font-weight="500" letter-spacing="-0.5">${p.title}</text>
    <text x="${W - 72}" y="${H - 72}" font-size="22" text-anchor="end" opacity="0.6" letter-spacing="3">${kind.toUpperCase()} — 0${n}</text>
    <text x="${W - 72}" y="96" font-size="20" text-anchor="end" opacity="0.5" letter-spacing="3">PLACEHOLDER</text>
  </g>`;

function cover(p) {
  return `
  <rect width="${W}" height="${H}" fill="${p.bg}"/>
  <rect x="0" y="${H * 0.5}" width="${W}" height="150" fill="${LIME}"/>
  <path d="M ${W * 0.56} ${H} L ${W * 0.56} ${H * 0.36} A 300 300 0 0 1 ${W * 0.56 + 600} ${H * 0.36} L ${W * 0.56 + 600} ${H} Z" fill="${p.soft}"/>
  <circle cx="${W * 0.3}" cy="${H * 0.42}" r="230" fill="${p.warm}"/>
  <circle cx="${W * 0.3}" cy="${H * 0.42}" r="230" fill="none" stroke="${p.fg}" stroke-opacity="0.25" stroke-width="2" transform="translate(40 30)"/>
  <rect x="${W * 0.56 + 210}" y="${H * 0.52}" width="180" height="180" rx="90" fill="${p.bg}"/>
  ${label(p, 1, "cover")}`;
}

function research(p) {
  const notes = [];
  const cols = 5;
  const rows = 3;
  const nw = 200;
  const nh = 170;
  const gx = 46;
  const gy = 46;
  const ox = (W - (cols * nw + (cols - 1) * gx)) / 2;
  const oy = 230;
  let k = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      k++;
      const fill = k % 7 === 0 ? LIME : k % 4 === 0 ? p.warm : p.soft;
      const rot = ((k * 37) % 9) - 4;
      const x = ox + c * (nw + gx);
      const y = oy + r * (nh + gy);
      notes.push(
        `<g transform="rotate(${rot} ${x + nw / 2} ${y + nh / 2})"><rect x="${x}" y="${y}" width="${nw}" height="${nh}" rx="10" fill="${fill}"/>` +
          `<rect x="${x + 24}" y="${y + 34}" width="${nw * 0.6}" height="10" rx="5" fill="${p.fg}" opacity="0.35"/>` +
          `<rect x="${x + 24}" y="${y + 60}" width="${nw * 0.4}" height="10" rx="5" fill="${p.fg}" opacity="0.25"/></g>`,
      );
    }
  }
  return `
  <rect width="${W}" height="${H}" fill="${p.bg}"/>
  <path d="M ${ox - 20} ${oy - 70} C ${W * 0.35} ${oy - 140}, ${W * 0.65} ${oy + 20}, ${W - ox + 20} ${oy - 70}" fill="none" stroke="${p.fg}" stroke-opacity="0.3" stroke-width="3" stroke-dasharray="2 14" stroke-linecap="round"/>
  ${notes.join("\n")}
  ${label(p, 2, "research")}`;
}

function prototype(p) {
  const px = W / 2 - 190;
  const py = 150;
  const pw = 380;
  const ph = 780;
  return `
  <rect width="${W}" height="${H}" fill="${p.bg}"/>
  <circle cx="${W / 2}" cy="${H * 0.45}" r="420" fill="${p.soft}"/>
  <rect x="0" y="${H * 0.62}" width="${W}" height="110" fill="${LIME}"/>
  <rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="56" fill="${INK}"/>
  <rect x="${px + 16}" y="${py + 16}" width="${pw - 32}" height="${ph - 32}" rx="42" fill="${PAPER}"/>
  <rect x="${px + 48}" y="${py + 80}" width="${pw * 0.45}" height="16" rx="8" fill="${INK}" opacity="0.8"/>
  <rect x="${px + 48}" y="${py + 112}" width="${pw * 0.65}" height="12" rx="6" fill="${INK}" opacity="0.25"/>
  <rect x="${px + 48}" y="${py + 170}" width="${pw - 96}" height="260" rx="22" fill="${p.warm}"/>
  <circle cx="${px + pw / 2}" cy="${py + 300}" r="60" fill="${PAPER}" opacity="0.85"/>
  <rect x="${px + 48}" y="${py + 460}" width="${pw - 96}" height="14" rx="7" fill="${INK}" opacity="0.2"/>
  <rect x="${px + 48}" y="${py + 490}" width="${(pw - 96) * 0.7}" height="14" rx="7" fill="${INK}" opacity="0.2"/>
  <rect x="${px + 48}" y="${py + ph - 140}" width="${pw - 96}" height="72" rx="36" fill="${LIME}"/>
  <rect x="${px + pw / 2 - 50}" y="${py + ph - 110}" width="100" height="12" rx="6" fill="${INK}" opacity="0.7"/>
  <rect x="${W * 0.12}" y="${H * 0.22}" width="260" height="190" rx="18" fill="${PAPER}" opacity="0.9"/>
  <rect x="${W * 0.12 + 28}" y="${H * 0.22 + 36}" width="140" height="12" rx="6" fill="${INK}" opacity="0.5"/>
  <rect x="${W * 0.12 + 28}" y="${H * 0.22 + 64}" width="200" height="10" rx="5" fill="${INK}" opacity="0.2"/>
  <rect x="${W * 0.12 + 28}" y="${H * 0.22 + 86}" width="170" height="10" rx="5" fill="${INK}" opacity="0.2"/>
  <rect x="${W * 0.72}" y="${H * 0.48}" width="220" height="220" rx="110" fill="${p.warm}"/>
  ${label(p, 3, "prototype")}`;
}

for (const p of projects) {
  [cover, research, prototype].forEach((fn, i) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${p.title} — placeholder ${i + 1}">${defs}<g filter="url(#grain)">${fn(p)}</g></svg>\n`;
    fs.writeFileSync(path.join(OUT, `${p.slug}-${i + 1}.svg`), svg);
  });
}
console.log(`✓ ${projects.length * 3} placeholders written to public/placeholders`);
