# Tallwise

Tallwise is a private, installable child height estimator built with Astro, Tailwind CSS, and Cloudflare Pages. It combines an age-interpolated Khamis–Roche estimate, a Tanner mid-parental target, and an official CDC stature-for-age LMS projection into a transparent center estimate and range.

All measurements and saved predictions stay in the browser. The production build is static: there are no Pages Functions, APIs, accounts, databases, cookies, or server-side calculations.

## What is included

- Three-step metric/US calculator for ages 4–17.5
- Exact half-year Khamis–Roche coefficient tables with fractional-age interpolation
- Locally bundled CDC stature-for-age data derived from the official CDC CSV
- Capped puberty, sleep, and nutrition context adjustment
- Model-by-model result breakdown and visual height scale
- Local browser history with individual and bulk deletion
- Install prompt, web manifest, generated service worker, and offline fallback
- Five pre-rendered advice articles, advice search/filtering, and mini calculators
- Canonicals, sitemap, robots route, Open Graph/Twitter tags, and JSON-LD
- Cloudflare cache/security headers and dormant ad placements

## Local development

Requires Node.js 22.

```bash
npm install
npm run dev
```

Run the full verification build:

```bash
npm run build
```

This runs `astro check`, generates all static pages, and creates `dist/sw.js` with Workbox. Preview the production output with:

```bash
npm run preview
```

## Deploy to Cloudflare Workers

Connect the repository from **Cloudflare Dashboard → Workers & Pages → Create application → Import a repository**. The site is deployed as a static-assets Worker: Cloudflare serves the generated files directly from its edge without running application code or moving calculations off the client.

Use these build settings:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Node version | `22` |

Set `PUBLIC_SITE_URL` to the final HTTPS origin before the production build, for example `https://height.example.com`. Astro uses it for canonicals, social metadata, robots, and the sitemap.

For a direct deployment after authenticating Wrangler:

```bash
npm run build
npm run deploy
```

The `assets.directory` setting in `wrangler.jsonc` points Wrangler at `dist`, preserves Astro's clean-URL behavior, and serves the generated `404.html` for unknown routes. No Astro Cloudflare adapter or Worker entry point is needed because this project intentionally uses static SSG output and no server runtime.

## Advertising

Ads are disabled in the default build. Reserved placements render a neutral placeholder and load no third-party script.

To activate the included AdSense wiring, set both variables at build time:

```bash
PUBLIC_ADSENSE_CLIENT=ca-pub-xxxxxxxxxxxxxxxx
PUBLIC_ADSENSE_SLOT=xxxxxxxxxx
```

Enabling a third-party ad network invalidates the default zero-tracking privacy promise. Add appropriate consent controls and replace the default privacy policy before deploying an ad-enabled build.

## Scientific and product boundaries

Tallwise is educational, not medical advice. The Khamis–Roche model was developed in a specific historical population, a CDC percentile trajectory is not a CDC-endorsed adult-height predictor, and the composite weights are a transparent product choice rather than a clinically validated ensemble. The UI and methodology page state these limitations directly.

Primary references:

- [Khamis & Roche adult stature prediction paper](https://pubmed.ncbi.nlm.nih.gov/7936860/)
- [CDC growth-chart LMS data](https://www.cdc.gov/growthcharts/cdc-data-files.htm)
- [MedlinePlus growth chart overview](https://medlineplus.gov/ency/article/001910.htm)

## Project structure

```text
public/                  PWA icons, CDC data, static headers
scripts/generate-sw.mjs  Production service-worker generator
src/components/          Calculator, history, scale, ads, navigation
src/content/advice/      Static SEO guide content
src/layouts/             Global and article layouts
src/pages/               App, guides, legal, offline, and SEO routes
src/utils/               Prediction engine, CDC math, local storage
```
