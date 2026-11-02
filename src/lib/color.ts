import tokens from '../data/tokens.json';

export type Swatch = { step: number; hex: string; hsl: string };

export const families = [
  'red', 'green', 'blue', 'dlavender', 'bsapphire', 'mblue', 'mbrown', 'dwhite', 'black', 'white', 'gray',
] as const;

export function hexToHsl(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  let s = 0;
  if (d) {
    s = d / (1 - Math.abs(2 * l - 1));
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
  }
  return [Math.round((h * 60 + 360) % 360), Math.round(s * 100), Math.round(l * 100)];
}

export function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  const lin = (c: number) => (c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  return 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
}

const contrast = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

/** The better-contrasting of Figma's two text colours on a ground (WCAG contrast ratio). */
export function inkOn(hex: string): string {
  const ground = luminance(hex);
  return contrast(ground, luminance('#1c1c1c')) >= contrast(ground, luminance('#f5f5f5')) ? '#1c1c1c' : '#f5f5f5';
}

export function palette(family: string): Swatch[] {
  return tokens.color.tokens
    .filter((t) => typeof t.value === 'string' && new RegExp(`^${family}-\\d0$`).test(t.name))
    .map((t) => {
      const hex = (t.value as string).toUpperCase();
      const [h, s, l] = hexToHsl(hex);
      return { step: Number(t.name.split('-')[1]), hex, hsl: `${h}, ${s}, ${l}` };
    });
}
