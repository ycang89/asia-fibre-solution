/**
 * Strip accidental wrapping quotes from .env values and validate URL.
 * Values like `"http://localhost:3000"` (quotes included) break axios baseURL
 * and can produce bogus client-side paths under `/user/...`.
 */
export function normalizeHttpOrigin(raw: string | undefined): string {
  if (raw == null) return '';
  let s = String(raw).trim();
  while (
    s.length >= 2 &&
    ((s.startsWith('"') && s.endsWith('"')) ||
      (s.startsWith("'") && s.endsWith("'")))
  ) {
    s = s.slice(1, -1).trim();
  }
  s = s.replace(/\/$/, '');
  if (!s) return '';
  try {
    const u = new URL(s);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return '';
    return s;
  } catch {
    return '';
  }
}
