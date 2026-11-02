// Generates src/styles/tokens.generated.css from src/data/tokens.json.
// tokens.json is the single source of truth: pages read it too.
import { readFileSync, writeFileSync } from 'node:fs';

const tokens = JSON.parse(readFileSync('src/data/tokens.json', 'utf8'));
const cssName = (name) => `--${name.replace(/\./g, '_')}`;
const resolve = (value) => value.replace(/^\{(.+)\}$/, (_, ref) => `var(${cssName(ref)})`);

const dark = [];
const light = [];
const raw = [];

for (const token of tokens.color.tokens) {
  if (typeof token.value === 'string') {
    raw.push(`  ${cssName(token.name)}: ${token.value};`);
  } else {
    dark.push(`  ${cssName(token.name)}: ${resolve(token.value.dark)};`);
    light.push(`  ${cssName(token.name)}: ${resolve(token.value.light ?? token.value.dark)};`);
  }
}

const scale = (family) => family.tokens.map((t) => `  ${cssName(t.name)}: ${t.value};`);
const lines = [
  `/* Begonia: generated from src/data/tokens.json. Do not edit. */`,
  `:root {`,
  ...raw,
  ...scale(tokens.spacing),
  ...scale(tokens.radius),
  ...scale(tokens.shadow),
  ...scale(tokens.gradient),
  `  --font-display: ${tokens.type.families.display};`,
  `  --font-sans: ${tokens.type.families.sans};`,
  `  --font-italic: ${tokens.type.families.italic};`,
  `  color-scheme: dark;`,
  ...dark,
  `}`,
  `:root[data-theme='light'] {`,
  `  color-scheme: light;`,
  ...light,
  `}`,
  ``,
];

for (const group of tokens.type.groups) {
  for (const s of group.styles) {
    const family = s.family ? `--font-${s.family}` : group.family === 'display' ? '--font-display' : '--font-sans';
    lines.push(
      `.t-${s.name} {`,
      `  font-family: var(${family});`,
      `  font-size: ${s.fontSize};`,
      `  line-height: ${s.lineHeight};`,
      `  font-weight: ${s.fontWeight};`,
      s.letterSpacing ? `  letter-spacing: ${s.letterSpacing};` : null,
      s.fontStyle ? `  font-style: ${s.fontStyle};` : null,
      `}`,
    );
  }
}

writeFileSync('src/styles/tokens.generated.css', lines.filter((l) => l !== null).join('\n') + '\n');
console.log('tokens.generated.css written');
