// SVG and PNG assets bundled with the site: the source text (to copy) and a URL (to show and download).
const rawFiles = import.meta.glob('../assets/{meshes,logos}/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const urlFiles = import.meta.glob('../assets/{meshes,logos,brand}/*.{svg,png}', { query: '?url', import: 'default', eager: true }) as Record<string, string>;
const pngFiles = import.meta.glob('../assets/logos/png/*.png', { query: '?url', import: 'default', eager: true }) as Record<string, string>;

export type SvgAsset = { filename: string; raw: string; url: string };
export type DownloadAsset = { filename: string; url: string };

export function svgAsset(folder: 'meshes' | 'logos', name: string): SvgAsset {
  const key = `../assets/${folder}/${name}.svg`;
  const raw = rawFiles[key];
  const url = urlFiles[key];
  if (!raw || !url) throw new Error(`Missing SVG asset: ${key}`);
  return { filename: `${name}.svg`, raw, url };
}

/** The PNG export of a brand logo (see scripts/build-assets.mjs). */
export function logoPng(name: string): DownloadAsset {
  const url = pngFiles[`../assets/logos/png/${name}.png`];
  if (!url) throw new Error(`Missing PNG export: ${name}`);
  return { filename: `${name}.png`, url };
}

/** The Begonia logo exports, which are generated, not hand-made. */
export function begoniaLogo(): { svg: DownloadAsset; png: DownloadAsset } {
  const svg = urlFiles['../assets/brand/begonia-logo.svg'];
  const png = urlFiles['../assets/brand/begonia-logo.png'];
  if (!svg || !png) throw new Error('Missing Begonia logo exports. Run `npm run assets`.');
  return { svg: { filename: 'begonia-logo.svg', url: svg }, png: { filename: 'begonia-logo.png', url: png } };
}

export const kb = (bytes: number) => (bytes < 1024 ? `${bytes} B` : bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`);
