# Client agreements and DocuSign

## Current coach workflow

The private `/coach` desk includes a per-client agreement packet builder. The coach can select and save which requested forms belong to that client's packet. The existing `/client-portal` landing page remains the two coaching choices.

The builder is a preparation tool only. It does **not** create or send DocuSign envelopes, collect signatures, or assert that the listed forms are complete legal documents. The app currently has no DocuSign credentials or configured DocuSign templates. The “Send with DocuSign” control stays disabled until the integration is implemented and configured.

The supplied Personal Training Agreement & Informed Consent is shown as an owner draft for review. The remaining requested forms are outline-only requirements, not drafted legal instruments. Do not turn them into signature-ready text by inference. The optional photo/video/testimonial release is kept separate and unchecked by default. EZE-FIT app paperwork is listed as its own future workstream.

## Persistence

Coach selections are stored in `client_plans.agreement_selection`. Local SQLite creates/adds the column automatically. Neon/Postgres requires the additive migration `db/migrations/0006_client_agreement_selection.sql`; apply it through the owner's approved database workflow. This change has not run any production database migration.

## To enable real DocuSign sending

1. Have counsel review the agreement and policy language for each jurisdiction where coaching is offered. Supply owner decisions for cancellation, package/payment/refund terms, and any other missing terms.
2. Create and approve the corresponding templates in the EZE IRL DocuSign account. The app must load the actual account templates, their signer roles and current status; do not invent template IDs or use the outline catalog as a substitute.
3. Choose the authentication method and provision the DocuSign integration key, OAuth configuration, account/user context, and secret storage in the deployment platform. Never commit credentials. Request only required eSignature scopes.
4. Implement server-only template listing and envelope creation behind coach authorization, same-origin checks, rate limiting, idempotency, and an explicit enable flag. Send to the selected client's verified email, with a final confirmation showing the chosen template and recipient.
5. Add DocuSign Connect webhook verification or another authenticated status-sync path. Persist envelope ID, template identity, recipient, status, timestamps and audit events without copying sensitive health answers into DocuSign metadata.
6. Keep optional marketing consent in its own separate agreement and never make it a condition of ordinary coaching. Review data retention, completed-document access, account roles and incident handling with counsel.
7. Verify end-to-end in the DocuSign demo environment using synthetic client records, then have the owner approve production credentials and deployment separately.

DocuSign's API flow uses a template and signer information to create/send an envelope; signing itself is performed by the recipient. DocuSign describes remote signing by email and embedded signing as separate recipient experiences. This first UI assumes email delivery once a real integration is built; embedded signing is not implemented.

## Requested coaching paperwork captured in the catalog

Health/exercise readiness (PAR-Q style); emergency contact/procedures; goals/fitness assessment; nutrition/supplement scope; cancellation/rescheduling/late/no-show; payment/package terms; optional photo/video/testimonial release; privacy/client-information notice; communications/electronic records consent; location/gym/equipment; online/remote training; and progress/program modification. The project also separates future EZE-FIT app terms, privacy, health/fitness disclaimer, electronic consent, account/data policy, and specific permissions for sensitive/connected health data.

All forms remain draft/outlines pending professional review. No prices, session counts, policy terms, privacy practices, or legal outcomes have been invented.
