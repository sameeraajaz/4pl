# 4PL — Logistics. In sync.

A responsive, multi-page logistics website in orange, white and deep blue. Plain HTML, CSS and JavaScript, with custom SVG illustrations and locally bundled fonts. No build tool, framework, third-party runtime, API key or external asset host is required.

## Pages
- `/` — homepage, shipment planner, solutions, 4PL positioning, industries, FAQs and guides
- `/services/ocean-freight`
- `/services/air-freight`
- `/services/road-transport`
- `/services/4pl-supply-chain-management`
- `/about`
- `/contact`
- `/insights/3pl-vs-4pl`
- `/insights/freight-shipping-checklist`
- `/404` — not-found page, excluded from sitemap and marked noindex

## Deploy to Vercel
1. Extract this archive and push the contents of `4pl-website` to a Git repository.
2. Import the repository into Vercel.
3. Choose the **Other** framework preset, leave the Build Command empty and use the repository root as the output directory.
4. Deploy. `vercel.json` enables clean URLs and trailing-slash normalization.
5. When ready, connect the `4pl.com` domain through the project's Domains settings and complete the provided DNS instructions.

Canonical URLs, structured data, the sitemap and social sharing URLs currently use `https://4pl.com`. Change them consistently if the production hostname changes. Avoid indexing a separate preview hostname as the production site.

## Preview locally
Use a static server with clean URL resolution for `.html` files. For example, `npx serve .` from this directory. Opening `index.html` directly as a local file will not resolve root-relative navigation and asset URLs.

## Working interactions
- Responsive navigation, service-page links and cross-links between related content.
- A homepage planner that transfers the selected mode, origin and destination into the shipment form.
- Shipment forms with native validation and a locally generated downloadable brief.
- Accessible industry tabs with arrow-key, Home and End navigation.
- Native expandable FAQs.
- Labelled quote and tracking dialogs with native keyboard focus handling and Escape-to-close.
- Demo tracking reference: `4PL-DEMO-001`.
- Plain-text shipping checklist download.
- Reduced-motion preference support.

## SEO foundation
Unique titles and descriptions, canonical links, one H1 per page, semantic HTML, crawlable links, contextual service copy, FAQs, Organization/WebSite/WebPage/Service/BreadcrumbList JSON-LD, sitemap.xml, robots.txt, favicon and Open Graph/Twitter sharing image. Content and links are present in the HTML and do not depend on JavaScript to be indexed.

No keyword stuffing, fake locations, fabricated ratings, invented client logos, unsupported coverage figures, performance promises or certification claims are included. FAQ content is provided for readers; no promise of Google FAQ rich results is made.

## Before public launch
- Confirm that the draft service descriptions match the company's actual scope and operating model.
- Add verified company name, business contacts, office details, coverage, service restrictions and approved evidence of experience.
- Once locations are confirmed, develop useful location-specific content and appropriate business schema. Do not create repetitive city pages or invent an address.
- Connect forms to a secure backend or CRM if enquiries should be submitted. They currently only prepare local download files. Replace the preview notices when live behavior is connected.
- Connect tracking to the actual transport-management or carrier systems. The current demonstration does not return live shipment data and its sample route does not assert coverage.
- Confirm privacy/legal notices for the actual data collection, analytics and integrations before enabling them.
- Verify domain ownership, submit the sitemap in Search Console and inspect live indexing and page performance after deployment.

## Validation
Structural checks covered every page, local route and asset reference, canonical links, unique metadata, JSON-LD, image dimensions/alt text, ARIA targets, sitemap entries and SVG validity. DOM-based interaction tests passed for all page initializations, navigation, tracking, planner-to-form handoff, validation, safe brief generation and keyboard tabs. Offline layout renders were reviewed at desktop, 390px and 320px widths; these are not a substitute for a final live-browser/device pass on deployment.

## Font licenses
DM Sans and Manrope are bundled under the SIL Open Font License. License texts are in `assets/fonts`.
