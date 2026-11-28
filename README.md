# 4PL — Next.js / Vercel project

This is the complete Next.js project. Extract and upload **all files and folders** from this ZIP into your Git repository. The ZIP root contains `package.json`, `app/`, `public/`, `components/`, `data/`, `lib/` and `vercel.json`. There is no outer wrapper folder.

## Deploy to Vercel
1. Replace the previous static-only repository contents with the complete contents of this ZIP. Retain the repository’s Git history.
2. In Vercel, import that repository or redeploy the existing project.
3. **Framework Preset: Next.js**.
4. **Root Directory: the folder containing package.json** (repository root if you uploaded the ZIP contents directly).
5. **Install Command: npm ci**. **Build Command: npm run build**. `vercel.json` already sets both.
6. Clear any old **Output Directory override** such as `.`, `dist` or `public`; use the Next.js framework default.
7. Deploy. This project runs `next build` and serves its assets from `public/assets`.

Do not deploy only an HTML file, do not omit `public/`, and do not set `public/` as the project Root Directory. Upload all public images, scripts and fonts. The production build does not depend on the optional asset-check helper.

## Local use
```
npm ci
npm run dev
```
Production check:
```
npm run build
npm start
```

## What changed
The old live deployment served the homepage but returned 404 for `/assets/site.css`, `/assets/site.js` and `/assets/ship.svg`. The new Next.js layout imports the global stylesheet into the build, Next manages the compiled CSS URLs, and all illustrations/fonts/scripts are included under `public/assets`. Run `npm run check:assets` locally to verify public assets.

## Pages and behaviour
Includes the current responsive homepage, four service pages, About, Contact/shipment brief, two logistics guides, draft Privacy Policy and draft Terms & Conditions, custom 404, metadata, structured data, robots and sitemap. Content is delivered as prerendered server output. Existing native anchors perform full page navigation so the local interaction script initializes for each page. There are no external API, font or illustration dependencies at runtime.

Forms default to local downloadable text briefs. Optional SMTP enquiry submission is now implemented server-side and remains disabled until explicitly enabled and configured. It does not save leads to a CRM, calculate prices or book transport. See EMAIL-SETUP.md. Tracking now has a dedicated responsive React page at `/track-shipment`, with separate ocean, air and road samples, a route summary, shipment details and a milestone timeline. It remains a labelled local demonstration. See FORMS.md. Policy drafts remain noindex until the company and data-handling details are completed and reviewed.

The canonical production domain remains `https://4pl.com.pk`; update `metadataBase`, the page-content structured data, robots and sitemap consistently if you choose a different production domain. The default download/demo mode needs no secrets. Optional email enquiries require the server-side SMTP settings described in EMAIL-SETUP.md.

## Editing
- Page content and JSON-LD: `data/pages.json` (trusted, version-controlled HTML; never interpolate untrusted content).
- Shared rendering and SEO: `components/SitePage.tsx`, `lib/pages.ts`, `app/layout.tsx`.
- Design: `app/globals.css`.
- Shipment tracking UI: `components/ShipmentTracking.tsx` and `app/track-shipment/page.tsx`.
- Shared tracking-page shell: `components/SiteShell.tsx`.
- Other interactions: `public/assets/site.js`.
- Illustrations, fonts and brand files: `public/assets/`.

## Before launch
Confirm the company's actual service scope, legal name, address, operating coverage and privacy contact. Connect live enquiries and carrier tracking separately if required. The legal pages are website drafts, not freight service contracts or a claim of jurisdiction-specific compliance.

## Tracking
See TRACKING.md for the demo references and the data connection needed for real shipment updates. Header and footer tracking links now open `/track-shipment`; the earlier tracking dialog has been removed. Service cards also have more consistent spacing and aligned actions.

## Animated hero and optional email enquiries
The homepage now has three seamless, continuously looping wave layers behind the ship. Reduced-motion preferences disable the animation.

The email endpoint is `/api/enquiries` (GET reports readiness only; POST accepts an enquiry when configured). SMTP code is in `lib/enquiries.ts`, and a blank `.env.example` lists the settings. The endpoint and UI were verified with mocks; configure your actual provider and perform an authorised delivery test before relying on it.


## Brand and business details
Production URL: https://4pl.com.pk . Company: 4PL LOGISTICS PVT LTD. Office # 709, 7th Floor, Falak Corporate City, Talpur Road Near NBP Head Office, Karachi-Pakistan. Mobile: +92 307 252 4519. PABX: 021-32411028 / 021-32411029. Email: info@4pl.com.pk. Directions and Instagram links use the owner-supplied destinations. The supplied logo is used in the header/footer, favicon and share image. All contact information is based on the owner’s supplied details; the office address is not represented as a verified registered address.

Bright orange (#F36F21) is the primary accent. Navy (#0F2A5C) is the secondary colour and the text colour on orange, because white on #F36F21 does not meet WCAG AA. Large orange headings use #E86521 so they clear 3:1. Rich blue panels use light text. Decorative curved transitions and animated waves respect reduced-motion preferences. Representative stock photography is identified and credited in PHOTO-CREDITS.md.

Email delivery remains disabled until SMTP settings and ENQUIRIES_ENABLED=true are configured. Default enquiry recipient: info@4pl.com.pk. Legal pages remain drafts pending the actual provider, retention and applicable-terms review.


## Human-focused design refinement
A representative worker photo and direct Karachi phone link now appear in the hero. The homepage includes a photographic conversation section with three native keyboard-accessible disclosure panels. Each action opens the existing shipment form or contact page; the supply-chain action preselects the relevant service. About includes a Karachi office story and service sidebars offer direct phone/email contact. No staff identities, customer endorsements or response-time promises are invented. Subtle below-fold reveals are progressive enhancement and disabled for reduced motion. The original ship and looping waves remain.

## Deployment fix
Production build: `next build --webpack`. The asset-check helper is now optional (`npm run check:assets`). Use Node.js 24.x, Build Command `npm run build`, and the default Next.js Output Directory. Upload every extracted folder.
