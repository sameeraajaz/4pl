# Track shipment: current behaviour and live integration

## What visitors do
1. Open **Track shipment** in the header or footer.
2. Choose an ocean, air or road sample.
3. Use **Explore demo shipment**, or enter one of these references and select **View shipment**:

| Reference | Demonstration |
| --- | --- |
| 4PL-DEMO-001 | Ocean freight |
| 4PL-DEMO-002 | Air freight |
| 4PL-DEMO-003 | Road transport |

The result displays origin, destination, transport type, illustrative cargo, an “In transit” status and four milestones. Completed, current and upcoming events have text labels as well as distinct markers.

A known reference is recognised regardless of the selected sample mode; the mode automatically updates to the matching shipment. Spaces around a reference and letter case are normalised. Unknown references show a clear message. Editing a reference or changing mode clears stale results.

## Current data source
The three shipments are fixed examples inside `components/ShipmentTracking.tsx`. There is no carrier lookup, GPS feed, live ETA, real booking record, shipment database or network call from the tracking search. The sample cities do not establish service coverage. Demo mode is disclosed before search and with the result.

The React form remains disabled in server-rendered output until event handlers are active, so a normal submission cannot fall back to putting the reference in a request URL. No tracking reference is saved in browser storage.

## What makes tracking real
Real progress must come from an operational data source. Two possible models are:

- **Carrier or transport-management integration:** a server-side endpoint authenticates the request as appropriate, matches the reference to an authorised shipment and queries the configured logistics system. The page presents the returned status and events with source/update information. ETA should only appear when the source supplies one, with its meaning and freshness clear.
- **Managed shipment records:** authorised operations staff maintain shipment milestones in a backend. Customers look up records they are permitted to see. This provides real business updates, but it is not automatic carrier or GPS tracking.

The carrier/TMS or shipment-record system has not been chosen. API credentials belong on the server, not in a public browser bundle. Real shipment details require suitable access controls so one customer's reference cannot expose another customer's information. The privacy notice needs to reflect the chosen data source and retention before this integration goes live.

## Verification
- Production Next.js build and TypeScript checks passed.
- React DOM interaction checks passed for all three samples, reference search, unknown-reference handling, input normalisation, mode switching, timeline output and stale-result clearing.
- The tracking demonstration made no network requests in the interaction check.
- Offline layout renders were reviewed at desktop, 390px and 320px widths; a live device/browser check is still appropriate after deployment.
