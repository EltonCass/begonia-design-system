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

## License

The code is MIT licensed; see [LICENSE.txt](LICENSE.txt). The Begonia artwork, the third-party brand logos and the Mosk
font files are not covered by it and keep their own terms, as that file explains.

## Brand assets

`npm run assets` rebuilds the downloadable files (the Begonia logo as PNG and SVG, and a PNG for every logo in
`src/assets/logos`) and `src/data/brand-assets.json`. The generated files are committed, so the build does not need to run it.
