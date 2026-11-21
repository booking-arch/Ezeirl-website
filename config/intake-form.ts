/**
 * Public /intake Google Form.
 *
 * Create the form under booking@ezeirl.com from docs/intake-google-form-questions.md,
 * then paste the embed URL here. In Google Forms: Send → embed HTML → copy the iframe src.
 * It looks like https://docs.google.com/forms/d/e/FORM_ID/viewform?embedded=true
 *
 * Leave this empty until that form exists. Responses stay in Google Forms.
 * This site does not store them, and INTAKE_ENABLED stays off.
 */
export const INTAKE_GOOGLE_FORM_EMBED_URL = "";

/** Accept only a Google Forms viewform URL. Anything else is treated as not connected. */
const GOOGLE_FORM_EMBED = /^https:\/\/docs\.google\.com\/forms\/d\/e\/[A-Za-z0-9_-]+\/viewform(?:\?[^#]*)?$/;

export function intakeGoogleFormEmbedUrl(value: string = INTAKE_GOOGLE_FORM_EMBED_URL): string | null {
  const url = value.trim();
  return GOOGLE_FORM_EMBED.test(url) ? url : null;
}
