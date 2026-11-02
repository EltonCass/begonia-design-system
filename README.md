# Begonia style guide

A responsive static site for the Begonia design system, built from the "Begonia" style guide in Figma.
Pages: cover, Color, Typography, Spacing, Shadows & borders, Layouts, Iconography and Brand.
Components are planned for a later phase.

Built with [Astro](https://astro.build) and plain CSS, no UI framework.

## Develop

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # type-checks, then builds to dist/
npm run preview
```

## How tokens work

`src/data/tokens.json` is the single source of truth (exported from the Begonia design system).
`npm run tokens` turns it into CSS custom properties at `src/styles/tokens.generated.css`,
which `dev` and `build` run first. Pages read the same JSON for their palettes and scales.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds with `SITE` and `BASE` set from the
repository and publishes to GitHub Pages. Enable it once under **Settings > Pages > Source: GitHub Actions**.
