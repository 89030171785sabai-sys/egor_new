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
  /** Card picture inside `public/`, e.g. `blog/<slug>/thumb.webp`; null → a site photo. */
  thumb: string | null
}

export const blogEntries: BlogEntry[] = [
  ...articles.map<BlogEntry>((article) => ({
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    tag: article.tag,
    readingMinutes: article.readingMinutes,
    date: article.date,
    thumb: article.hasHero ? `blog/${article.slug}/thumb.webp` : null,
  })),
].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))

/** Rubrics, the most populated first. */
export const blogTags = Object.entries(
  blogEntries.reduce<Record<string, number>>((count, entry) => {
    count[entry.tag] = (count[entry.tag] ?? 0) + 1
    return count
  }, {}),
)
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'ru'))
  .map(([tag, total]) => ({ tag, total }))
