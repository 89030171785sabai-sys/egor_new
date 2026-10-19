/**
 * One list for the whole blog: the four hand-written posts and the imported
 * articles. The listing, the page and the sitemap all read from here.
 */
import { articles } from './articles'
import { sortedPosts } from './posts'

export interface BlogEntry {
  slug: string
  title: string
  excerpt: string
  tag: string
  readingMinutes: number
  /** ISO date; only the hand-written posts carry one. */
  date?: string
  /** Card picture inside `public/`, e.g. `blog/<slug>/thumb.webp`; null → a site photo. */
  thumb: string | null
  kind: 'post' | 'article'
}

export const blogEntries: BlogEntry[] = [
  ...sortedPosts.map<BlogEntry>((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    tag: post.tag,
    readingMinutes: post.readingMinutes,
    date: post.date,
    thumb: null,
    kind: 'post',
  })),
  ...articles.map<BlogEntry>((article) => ({
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    tag: article.tag,
    readingMinutes: article.readingMinutes,
    thumb: article.hasHero ? `blog/${article.slug}/thumb.webp` : null,
    kind: 'article',
  })),
]

/** Rubrics, the most populated first. */
export const blogTags = Object.entries(
  blogEntries.reduce<Record<string, number>>((count, entry) => {
    count[entry.tag] = (count[entry.tag] ?? 0) + 1
    return count
  }, {}),
)
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'ru'))
  .map(([tag, total]) => ({ tag, total }))
