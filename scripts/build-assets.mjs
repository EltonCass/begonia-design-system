// Exports the downloadable brand files from their sources. Run with `npm run assets`.
//   - Begonia logo: a circle-masked PNG, and an SVG that clips the artwork to a circle.
//   - Figma, GitHub, LinkedIn: a transparent PNG next to each SVG.
// Sizes are written to src/data/brand-assets.json so the Brand page never hard-codes them.
import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const LOGO_SIZE = 887; // Figma masks the artwork with an 887px circle, offset 9px from the image's left edge
const OFFSET_X = 9;

mkdirSync('src/assets/brand', { recursive: true });
mkdirSync('src/assets/logos/png', { recursive: true });

const out = { begonia: {}, logos: {} };

// ---- Begonia logo ----
const source = 'src/assets/begonia-flower.png';
const flower = await sharp(source).extract({ left: OFFSET_X, top: 0, width: LOGO_SIZE, height: 883 }).toBuffer();
const circle = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${LOGO_SIZE}" height="${LOGO_SIZE}"><circle cx="${LOGO_SIZE / 2}" cy="${LOGO_SIZE / 2}" r="${LOGO_SIZE / 2}"/></svg>`,
);
const png = await sharp({ create: { width: LOGO_SIZE, height: LOGO_SIZE, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
  .composite([
    { input: flower, left: 0, top: 0 },
    { input: circle, blend: 'dest-in' },
  ])
  .png({ compressionLevel: 9 })
  .toBuffer();
writeFileSync('src/assets/brand/begonia-logo.png', png);

// The SVG embeds the artwork (a JPEG, so it stays small) and clips it to the same circle.
const jpeg = await sharp(source).jpeg({ quality: 90 }).toBuffer();
const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${LOGO_SIZE}" height="${LOGO_SIZE}" viewBox="0 0 ${LOGO_SIZE} ${LOGO_SIZE}">
  <title>Begonia logo</title>
  <defs><clipPath id="begonia-circle"><circle cx="${LOGO_SIZE / 2}" cy="${LOGO_SIZE / 2}" r="${LOGO_SIZE / 2}"/></clipPath></defs>
  <g clip-path="url(#begonia-circle)">
    <image x="-${OFFSET_X}" y="0" width="902" height="883" xlink:href="data:image/jpeg;base64,${jpeg.toString('base64')}"/>
  </g>
</svg>
`;
writeFileSync('src/assets/brand/begonia-logo.svg', svg);
out.begonia = {
  width: LOGO_SIZE,
  height: LOGO_SIZE,
  png: { bytes: statSync('src/assets/brand/begonia-logo.png').size },
  svg: { bytes: statSync('src/assets/brand/begonia-logo.svg').size },
};

// ---- Brand logos: PNG from SVG, longest side 512px ----
for (const name of ['figma', 'github', 'linkedin']) {
  const file = `src/assets/logos/${name}.svg`;
  const text = readFileSync(file, 'utf8');
  const [, w, h] = text.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  const buffer = await sharp(Buffer.from(text), { density: 450 })
    .resize(512, 512, { fit: 'inside' })
    .png({ compressionLevel: 9 })
    .toBuffer();
  const meta = await sharp(buffer).metadata();
  writeFileSync(`src/assets/logos/png/${name}.png`, buffer);
  out.logos[name] = {
    svg: { width: Number(w), height: Number(h), bytes: statSync(file).size },
    png: { width: meta.width, height: meta.height, bytes: buffer.length },
  };
}

writeFileSync('src/data/brand-assets.json', JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
