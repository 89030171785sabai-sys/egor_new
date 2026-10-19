/**
 * Articles go live in batches rather than all at once: PER_DAY of them on the
 * day RELEASE_START and again on every following day, counted by Moscow time.
 * The site is rebuilt every night (see .github/workflows/ftp.yml), and each
 * build lists only the articles whose turn has come — in the listing, the
 * pages, the sitemap and the "read also" blocks alike.
 *
 * The import script gives every article the date of its batch; keep the two
 * numbers below equal to FIRST_DATE and PER_DAY in scripts/import-articles.py.
 */
export const RELEASE_START = '2026-10-19'
export const PER_DAY = 10

const MOSCOW_OFFSET_MS = 3 * 60 * 60 * 1000
const DAY_MS = 24 * 60 * 60 * 1000

/** How many articles, counted from the first, are live at the given moment. */
export function releasedCount(now: Date = new Date()): number {
  const moscow = new Date(now.getTime() + MOSCOW_OFFSET_MS)
  const today = Date.UTC(moscow.getUTCFullYear(), moscow.getUTCMonth(), moscow.getUTCDate())
  const [year, month, day] = RELEASE_START.split('-').map(Number) as [number, number, number]
  const days = Math.floor((today - Date.UTC(year, month - 1, day)) / DAY_MS)

  return days < 0 ? 0 : PER_DAY * (days + 1)
}
