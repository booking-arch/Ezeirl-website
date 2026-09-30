import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);
const KEYLEN = 32;

/** Used when the email is unknown so a failed login takes the same time as a wrong password. */
export const DUMMY_PASSWORD_HASH =
  "scrypt$OcBMmZfNG2713lAP1-VVeg$bJyil2ndTM-Q4R5WlkZ3mdZO4kH_U70IczLNOkV9FXs";

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("base64url");
  const hash = (await scryptAsync(password, salt, KEYLEN)) as Buffer;
  return `scrypt$${salt}$${hash.toString("base64url")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algo, salt, hash] = stored.split("$");
  if (algo !== "scrypt" || !salt || !hash) return false;
  let actual: Buffer;
  try {
    actual = (await scryptAsync(password, salt, KEYLEN)) as Buffer;
  } catch {
    return false;
  }
  const expected = Buffer.from(hash, "base64url");
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}
