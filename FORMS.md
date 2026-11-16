# Forms: what exists and what actually happens

| Tool | Where | Current behaviour |
| --- | --- | --- |
| Shipment planner | Homepage, below the hero | Accepts transport mode, origin and destination. “Build your brief” opens the shipment dialog and copies those values into it. |
| Shipment brief form | “Plan a shipment” buttons throughout the website, plus the full form on `/contact` | Collects the fields below, validates required details, and creates a local download link for a plain-text shipment brief. |
| Tracking form | `/track-shipment`, linked from header and footer | Checks references locally: `4PL-DEMO-001` (ocean), `4PL-DEMO-002` (air), `4PL-DEMO-003` (road). Shows fictional route, cargo, status and milestone information. Unknown references explain that live tracking is not connected. |

## Shipment fields
- Name — required
- Company — optional
- Email — required, native email-format validation
- Origin — required
- Destination — required
- Solution — ocean, air, road, 4PL/supply chain or help me choose
- Approximate weight in kg — optional; positive values only
- Cargo ready date — optional
- Cargo and handling details — optional, with a length limit

The homepage selector changes the intended enquiry type: choosing a supply-chain need selects the 4PL option. A service-page button selects that service before opening the same brief form.

## After “Create shipment brief”
1. JavaScript reads the active form fields.
2. It prepares a `.txt` file within the page.
3. The result displays a download link. The visitor chooses whether to save it.
4. The visitor can share the downloaded file themselves using their chosen channel.

In default download mode, the site does not submit an enquiry. If SMTP submission is explicitly enabled and configured, the primary action becomes Send enquiry, posts the fields to the server-side /api/enquiries endpoint, and emails the configured business inbox. It does not create a CRM record, reserve capacity, calculate a price or book transport. The visitor email is the contact detail in a brief or the Reply-To for an email enquiry. See EMAIL-SETUP.md.

Editing the form hides and invalidates its old download link to avoid presenting a stale brief. Native constraints validate fields in ordinary submission. Form content is written as text in a file rather than inserted as HTML.

Submit controls are disabled in the source and enabled only after the local handlers are attached. If JavaScript is unavailable, the page offers the blank checklist instead. This avoids normal form submission falling back to a request containing the field values.

## Data handling
The supplied form code has no enquiry database, cookies, localStorage, carrier connection or third-party form embed. Optional server-side SMTP delivery sends submitted fields to the configured email service and business inbox. Browser autofill/session restore and downloaded files are controlled by the visitor’s device/browser settings. Hosting may separately generate technical request or security records. The Privacy Policy distinguishes these behaviours.

## What is needed for live enquiries
Choose the actual receiving company inbox or CRM, then implement a secure submission endpoint and connect the form to it. The live flow should validate on the server, apply suitable abuse protection, send or save the enquiry, and confirm success only after the server accepts it. Failed submissions should preserve the entered details and offer a clear retry path.

Do not place private email, CRM or carrier API credentials in browser JavaScript. Update the privacy notice, retention and recipients to match the chosen system before enabling live submissions. Tracking similarly needs a real carrier/TMS integration with the appropriate access controls; a local demo reference is not a tracking backend.

## Current SMTP implementation
The secure server-side SMTP endpoint and mode-aware UI are now included. Sending is disabled until ENQUIRIES_ENABLED=true and all SMTP/sender/recipient settings are valid. The backend uses fixed sender and recipient settings, server validation and best-effort abuse controls; the UI preserves fields on failure. Read EMAIL-SETUP.md for configuration and limitations. The remaining live-enquiry roadmap above now refers to choosing/configuring the actual provider or an additional CRM integration.
