// SVG assets bundled with the site: the source text (to copy) and a URL (to show and download).
const rawFiles = import.meta.glob('../assets/{meshes,logos}/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const urlFiles = import.meta.glob('../assets/{meshes,logos}/*.svg', { query: '?url', import: 'default', eager: true }) as Record<string, string>;

export type SvgAsset = { filename: string; raw: string; url: string };

export function svgAsset(folder: 'meshes' | 'logos', name: string): SvgAsset {
  const key = `../assets/${folder}/${name}.svg`;
  const raw = rawFiles[key];
  const url = urlFiles[key];
  if (!raw || !url) throw new Error(`Missing SVG asset: ${key}`);
  return { filename: `${name}.svg`, raw, url };
}
