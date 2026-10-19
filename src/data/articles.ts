/**
 * Articles of the blog's second series. The list itself (`articles.generated.ts`)
 * and the texts (`src/content/articles/<slug>.html`) are produced from the
 * client's source folders by `scripts/import-articles.py`; nothing here is
 * edited by hand. A text is a plain HTML fragment — sections, tables and
 * diagrams — loaded only when its page is opened.
 */
import { generatedArticles } from './articles.generated'
import type { ArticleSummary } from './articles.types'

export type { ArticleSummary }

export const articles: ArticleSummary[] = generatedArticles

const loaders = import.meta.glob('../content/articles/*.html', {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>

/** Fetches the HTML of one article; resolves to null when there is none. */
export async function loadArticleBody(slug: string): Promise<string | null> {
  const load = loaders[`../content/articles/${slug}.html`]
  return load ? load() : null
}
