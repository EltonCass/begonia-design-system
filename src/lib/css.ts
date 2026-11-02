import tokens from '../data/tokens.json';

type Token = { name: string; value: unknown };
const all: Token[] = [
  ...tokens.color.tokens,
  ...tokens.spacing.tokens,
  ...tokens.radius.tokens,
  ...tokens.shadow.tokens,
  ...tokens.gradient.tokens,
];

/** Resolved value of a flat token (palette color, shadow, gradient...). */
export function tok(name: string): string {
  const t = all.find((x) => x.name === name);
  if (!t || typeof t.value !== 'string') throw new Error(`Unknown flat token: ${name}`);
  return t.value;
}

/** The CSS a text style stands for, as copied by the typography cards. */
export function typeCss(styleName: string, extra: string[] = []): string {
  for (const group of tokens.type.groups) {
    const s = group.styles.find((x) => x.name === styleName);
    if (!s) continue;
    const families = tokens.type.families as Record<string, string>;
    const family = families[('family' in s && s.family ? s.family : group.family) as string];
    return [
      `font-family: ${family};`,
      `font-size: ${s.fontSize};`,
      `line-height: ${s.lineHeight};`,
      `font-weight: ${s.fontWeight};`,
      'letterSpacing' in s && s.letterSpacing ? `letter-spacing: ${s.letterSpacing};` : null,
      'fontStyle' in s && s.fontStyle ? `font-style: ${s.fontStyle};` : null,
      ...extra,
    ]
      .filter(Boolean)
      .join('\n');
  }
  throw new Error(`Unknown type style: ${styleName}`);
}
