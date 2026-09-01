# Brookings Area Roller Derby

Static Astro website for Brookings Area Roller Derby (BARD), deployed to Cloudflare Pages.

## Requirements

- Node.js 22.12 or newer
- npm
- Wrangler authentication for deployment

Install dependencies with `npm install`.

## Development

Start the Astro development server in background mode:

```sh
npm run dev
```

Manage it with `astro dev status`, `astro dev logs`, and `astro dev stop`.

## Content

Roster members, bouts, community events, and sponsors live under `src/content/`. Their
frontmatter is validated by `src/content.config.ts` during checks and builds.

Event timestamps must be ISO 8601 values with an explicit UTC offset. Brookings uses Central
Time, so summer events normally use `-05:00` and winter events normally use `-06:00`.

The site currently runs in demo mode through `src/config/site.ts`. Demo mode displays a public
warning and emits `noindex, nofollow`. Before switching it off, verify every name, date, sponsor,
link, nonprofit/tax statement, attendance figure, benefit, and organizational claim.

Shared identity, contact, season, timezone, social metadata, and demo settings also live in
`src/config/site.ts`.

## Verification

Run every quality gate with:

```sh
npm run verify
```

Individual commands are available for type-checking (`npm run check`), linting (`npm run lint`),
format validation (`npm run format:check`), tests (`npm test`), and the production build
(`npm run build`).

## Deployment

After verification and content approval, deploy the static `dist/` output with:

```sh
npm run deploy
```
