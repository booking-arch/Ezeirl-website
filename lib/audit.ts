/**
 * Structured audit trail for staff actions on client data. One JSON line per event on stdout, which Cloud Run /
 * Firebase App Hosting ingests into Cloud Logging (searchable, retained by the project's log policy).
 *
 * Privacy rule: log WHO (account id) did WHAT to WHICH record (id) and WHEN — never names, emails, or any
 * questionnaire / plan content. Only primitive values are accepted so content can't be passed by accident.
 */
export type AuditFields = Record<string, string | number | boolean | null>;

export function audit(event: string, fields: AuditFields = {}): void {
  try {
    console.info(JSON.stringify({ audit: true, event, at: new Date().toISOString(), ...fields }));
  } catch {
    /* auditing must never break the request */
  }
}
