/** Head of one imported blog article; see data/articles.ts. */
export interface ArticleSummary {
  slug: string
  /** Number in the client's plan; keeps the series in its intended order. */
  order: number
  title: string
  /** The opening paragraph, shown on cards and under the title. */
  excerpt: string
  tag: string
  readingMinutes: number
  seoTitle: string
  seoDescription: string
  /** False where the source had no main photo; a site photo stands in then. */
  hasHero: boolean
  heroAlt: string
}
