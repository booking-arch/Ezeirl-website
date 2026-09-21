/**
 * Email / name normalization. Isomorphic (no node-only imports) so the browser form and the API
 * apply the same rules.
 *
 * We deliberately do NOT collapse Gmail dots or "+tags": those are different mailboxes to some
 * providers and merging them could attach one person's signup to another's. Uniqueness is on
 * trimmed, NFKC-normalized, lower-cased address with the domain converted to ASCII (punycode).
 */
const MAX_EMAIL = 254;
const MAX_LOCAL = 64;
// Pragmatic local-part: RFC 5322 "atext" plus dots, no leading/trailing/double dots.
const LOCAL_RE = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/i;
const LABEL_RE = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/i;

export function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const value = raw.normalize("NFKC").trim().toLowerCase();
  if (!value || value.length > MAX_EMAIL || /[\s\u0000-\u001f\u007f]/.test(value)) return null;

  const at = value.lastIndexOf("@");
  if (at < 1 || at !== value.indexOf("@")) return null; // exactly one "@", not first
  const local = value.slice(0, at);
  const domainRaw = value.slice(at + 1);
  if (local.length > MAX_LOCAL || !LOCAL_RE.test(local)) return null;

  let domain: string;
  try {
    domain = new URL(`http://${domainRaw}`).hostname; // punycode-encodes IDN
  } catch {
    return null;
  }
  const labels = domain.split(".");
  if (labels.length < 2 || domain.length > 253) return null;
  if (!labels.every((l) => LABEL_RE.test(l))) return null;
  if (/^\d+$/.test(labels[labels.length - 1])) return null; // reject bare IPv4-looking domains

  return `${local}@${domain}`;
}

/** Returns a cleaned first name, `null` when empty, or `undefined` when invalid. */
export function normalizeFirstName(raw: unknown): string | null | undefined {
  if (raw === undefined || raw === null) return null;
  if (typeof raw !== "string") return undefined;
  const value = raw.normalize("NFKC").replace(/\s+/g, " ").trim();
  if (!value) return null;
  if (value.length > 60) return undefined;
  // Letters (any script), marks, spaces, apostrophes, hyphens, periods. No markup or digits.
  if (!/^[\p{L}\p{M}][\p{L}\p{M}' .-]*$/u.test(value)) return undefined;
  return value;
}
