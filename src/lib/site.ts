/**
 * Canonical origin of the site. Punycode, so it stays valid in XML and headers.
 * A preview deployment overrides it through VITE_SITE_ORIGIN, which keeps
 * canonicals and the sitemap pointing at wherever the build actually lives.
 */
export const SITE_ORIGIN =
  import.meta.env.VITE_SITE_ORIGIN ?? 'https://xn----7sbnf7av3f.xn--p1ai'

export const SITE_NAME = 'Дым и Пар'
