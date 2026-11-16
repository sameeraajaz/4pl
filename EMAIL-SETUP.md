# Enable email enquiries on Vercel

The code now includes an SMTP-backed `/api/enquiries` endpoint. It is disabled by default. No credentials are included and no live test message was sent during development.

## What you need
- An SMTP service/account that permits authenticated website/transactional sending.
- Its hostname, port, username and password/token. Use the provider's approved app password or SMTP token where required.
- A verified sender address allowed by that provider.
- The business inbox or group that should receive enquiries.
- Any sender-domain verification records requested by the email provider.

## Vercel settings
Open **Project → Settings → Environment Variables** and add these server-side variables to the intended environment:

| Variable | Value |
| --- | --- |
| ENQUIRIES_ENABLED | `true`, only when ready to accept enquiries |
| SMTP_HOST | SMTP hostname from your provider |
| SMTP_PORT | Usually `587` for STARTTLS or `465` for implicit TLS |
| SMTP_USER | SMTP username |
| SMTP_PASS | SMTP password, SMTP token or approved app password |
| SMTP_FROM | A single verified sender email, e.g. enquiries@your-domain |
| ENQUIRY_TO | The single inbox/group that should receive enquiries |

Enter credentials directly in Vercel. Do not prefix private settings with `NEXT_PUBLIC_`, place them in the source, or put them in DNS records. Keep Preview credentials separate from Production if you enable Preview sending. Redeploy after changing variables. For local development, copy `.env.example` to `.env.local` and fill it locally; real environment files are excluded from the ZIP and ignored by Git.

The endpoint permits authenticated SMTP submission ports and refuses port 25. Port 465 uses implicit TLS; other allowed ports require STARTTLS. Keep TLS certificate checking enabled. If a provider requires a different authentication method, implement its approved flow rather than substituting a normal account password.

## DNS is separate from SMTP credentials
If your sender domain is not already authorised for the chosen email service, the provider may require SPF and DKIM records; configure DMARC according to the domain's email policy as well. Add the exact records supplied by that provider at the authoritative DNS service for the domain. That is Vercel only when Vercel manages the domain's DNS—not merely because Vercel hosts the website.

Preserve existing mailbox routing. Do not replace existing MX records just to connect a contact form. If the provider needs records on a sending/return-path subdomain, use exactly those hostnames. Have an existing SPF record updated appropriately rather than creating conflicting SPF records. The provider should verify the records before production sending is enabled.

## How the form behaves
- Email disabled/missing configuration: the existing downloadable-brief mode remains available.
- Email enabled with valid settings: the primary action becomes **Send enquiry**, with a separate **Download a brief instead** option.
- The server validates the fields and sends plaintext email to `ENQUIRY_TO` from `SMTP_FROM`; the visitor email is used as **Reply-To**.
- The request waits for SMTP acceptance. The interface confirms acceptance only after the server succeeds. Acceptance is not a guarantee of inbox placement or a confirmed booking.
- Failures preserve entered details and leave a download alternative. A network timeout may leave acceptance uncertain; check before resubmitting to avoid duplicates.
- Editing after a successful submission enables another submission; the unchanged form's send button stays disabled after success.

There is no CRM database write in this version. A CRM connection needs its own selected API or webhook and the appropriate access. Tracking, prices, bookings and payments remain separate integrations.

## Abuse and data handling
The endpoint fixes the recipient and sender server-side, uses server validation and a honeypot, checks request origin, limits payload size, and has a bounded per-instance attempt throttle. The throttle is best effort and is not a distributed rate limiter; use an appropriate shared/gateway control when volume or abuse requires one. No private SMTP settings are exposed by the readiness endpoint.

Email contents will be handled by the configured SMTP provider and business inbox. Complete the legal entity, privacy contact, recipient/retention arrangements and applicable privacy review before enabling live collection. The policy drafts now distinguish local download mode from optional email submission.

## Verification and final live check
Production build, disabled/enabled-mode frontend tests, server validation, SMTP-failure handling, message construction and throttling checks passed using mocks. No actual email was sent. After configuring the real provider, submit an authorised test enquiry to your own receiving inbox, confirm receipt and Reply-To behaviour, and review spam/bounce/provider delivery information.

References:
- https://vercel.com/kb/guide/serverless-functions-and-smtp
- https://vercel.com/docs/environment-variables/managing-environment-variables
- https://nodemailer.com/smtp
