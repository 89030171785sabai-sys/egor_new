/**
 * The blog's entries for the listing and for "read also" blocks, newest first.
 */
import { articles } from './articles'

export interface BlogEntry {
  slug: string
  title: string
  excerpt: string
  tag: string
  readingMinutes: number
  /** ISO date, newest first in the listing. */
  date?: string
  /** Card picture inside `public/`, e.g. `blog-img/<slug>/thumb.webp`; null → a site photo. */
  thumb: string | null
  /** Number in the series; breaks ties between articles of one day. */
  order: number
}

export const blogEntries: BlogEntry[] = [
  ...articles.map<BlogEntry>((article) => ({
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    tag: article.tag,
    readingMinutes: article.readingMinutes,
    date: article.date,
    order: article.order,
    thumb: article.hasHero ? `blog-img/${article.slug}/thumb.webp` : null,
  })),
].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '') || a.order - b.order)

/** Rubrics, the most populated first. */
export const blogTags = Object.entries(
  blogEntries.reduce<Record<string, number>>((count, entry) => {
    count[entry.tag] = (count[entry.tag] ?? 0) + 1
    return count
  }, {}),
)
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'ru'))
  .map(([tag, total]) => ({ tag, total }))
