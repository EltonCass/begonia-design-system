import { samsa } from './copy';
import { tok } from './css';

/**
 * Prefix every selector so the same CSS that is shown in the CSS tab can run in the page without leaking.
 * Only plain rules are supported (no @-rules, no nesting), which is all these snippets use.
 */
export function scopeCss(css: string, scope: string): string {
  return css.replace(/(^|\})\s*([^{}]+)\{/g, (_m, close: string, selectors: string) => {
    const scoped = selectors
      .split(',')
      .map((s) => `${scope} ${s.trim()}`)
      .join(', ');
    return `${close}\n${scoped} {`;
  });
}

const FONT_IMPORT = (weights: string) => `@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@${weights}&display=swap');`;

/** The page tags are demoted in the preview so the page outline stays in order; the copied HTML keeps h1 and h2. */
const demote = (html: string) =>
  html.replace('<h1', '<h4').replace('</h1>', '</h4>').replace('<h2', '<h5').replace('</h2>', '</h5>');

/** Layouts > Use: an article laid out with one offset for the padding, the row gap and the column gap. */
export function useExample(n: number) {
  const html = [
    '<article class="use">',
    '  <h1 class="chapter">Chapter 1: Great Mornings</h1>',
    '  <h2 class="sub">Lucid Dream</h2>',
    `  <p class="cols">${samsa}</p>`,
    '</article>',
  ].join('\n');

  const rules = `.use {
  display: grid;
  gap: ${n}px;
  padding: ${n}px;
  outline: 1px dashed ${tok('bsapphire-30')};
  outline-offset: -1px;
}

.chapter {
  margin: 0;
  font-size: 28px;
  font-weight: 400;
}

.sub {
  margin: 0;
  font-size: 22px;
  font-weight: 400;
}

.cols {
  margin: 0;
  columns: 2 240px;
  column-gap: ${n}px;
  font-size: 14px;
  line-height: 1.45;
}`;

  const css = `${FONT_IMPORT('400')}

body {
  margin: 0;
  font-family: "Open Sans", sans-serif;
  color: ${tok('black-50')};
}

${rules}`;

  return { html, css, previewHtml: demote(html), previewCss: scopeCss(rules, `.cv-use-${n}`) };
}

/** Spacing > Demonstration: a box measured in 64px, 32px and 16px steps. */
export function spacingDemo() {
  const line = tok('mblue-30');
  const ink = tok('blue-80');
  const html = [
    '<div class="demo">',
    '  <div class="pad top">64 px</div>',
    '  <div class="pad left">64 px</div>',
    '  <div class="content">',
    '    <h1 class="h1">Chapter 1: Great Mornings</h1>',
    '    <div class="gap g32">32 px</div>',
    '    <h2 class="h2">Lucid Dream</h2>',
    '    <div class="gap g16">16 px</div>',
    `    <p class="para">${samsa}</p>`,
    '  </div>',
    '  <div class="pad right">64 px</div>',
    '  <div class="pad bottom">64 px</div>',
    '</div>',
  ].join('\n');

  const rules = `.demo {
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr) 64px;
  grid-template-rows: 64px auto 64px;
  background: ${tok('blue-10')};
  border: 1px solid ${line};
}

.pad {
  display: grid;
  place-items: center;
  color: ${ink};
  font-size: 14px;
}

.top {
  grid-column: 1 / -1;
  border-bottom: 1px solid ${line};
}

.bottom {
  grid-column: 1 / -1;
  border-top: 1px solid ${line};
}

.left { border-right: 1px solid ${line}; }
.right { border-left: 1px solid ${line}; }

.content {
  min-width: 0;
  color: #000;
}

.h1 {
  margin: 0;
  font-size: 32px;
  line-height: 1.2;
  font-weight: 400;
}

.h2 {
  margin: 0;
  font-size: 24px;
  line-height: 1.2;
  font-weight: 400;
}

.para {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}

.gap {
  display: grid;
  place-items: center;
  border: 1px solid ${line};
  color: ${ink};
  font-size: 10px;
}

.g32 { height: 32px; }
.g16 { height: 16px; font-size: 9px; }`;

  const css = `${FONT_IMPORT('400')}

body {
  margin: 0;
  font-family: "Open Sans", sans-serif;
}

${rules}`;

  return { html, css, previewHtml: demote(html), previewCss: scopeCss(rules, '.cv-demo') };
}
