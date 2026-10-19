import { useEffect, useMemo, useState, type MouseEvent, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { NotFoundPage } from './NotFoundPage'
import { PageHeader } from '../components/ui/PageHeader'
import { photoUrl } from '../lib/photos'
import { Reveal } from '../components/ui/Reveal'
import { FinalCta } from '../components/sections/FinalCta'
import { useSeo } from '../lib/seo'
import { articles, loadArticleBody, type ArticleSummary } from '../data/articles'
import { blogEntries, blogTags, type BlogEntry } from '../data/blog'

/** Real photographs for the articles, taken in turn so neighbours differ. */
const pictures = [
  'customization-scene.webp',
  'ritual-water.webp',
  'grafit-banner.webp',
  'nefrit-banner.webp',
  'valtsovavich-banner.webp',
  'cherny-brilliant-banner.webp',
  'oniks-banner.webp',
  'grant-banner.webp',
  'ritual-winter.webp',
]

/** Keeps a post's picture stable across renders and pages. */
const pictureFor = (index: number) => photoUrl(pictures[index % pictures.length]!)

/** A file kept in `public/`, addressed from the site's base path. */
const publicUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`

/** The entry's own picture where it has one, otherwise a site photo taken in turn. */
const thumbFor = (entry: BlogEntry, index: number) =>
  entry.thumb ? publicUrl(entry.thumb) : pictureFor(index)

const PAGE_SIZE = 12

export function BlogPage() {
  useSeo({
    title: 'Блог о банных чанах',
    description:
      'Как выбрать размер чана, сколько нужно дров, как ухаживать за нержавейкой и готовить площадку под установку.',
    path: '/blog',
  })

  const [tag, setTag] = useState<string | null>(null)
  const [shown, setShown] = useState(PAGE_SIZE)

  const entries = useMemo(
    () => (tag ? blogEntries.filter((entry) => entry.tag === tag) : blogEntries),
    [tag],
  )
  const [lead, ...rest] = entries
  const visibleRest = rest.slice(0, shown - 1)

  const choose = (next: string | null) => {
    setTag(next)
    setShown(PAGE_SIZE)
  }

  return (
    <>
      <PageHeader
        title="Блог"
        lead="Пишем о том, о чём нас спрашивают: как выбрать размер, чем топить, как ухаживать и что подготовить к доставке."
      />

      <section className="py-10 lg:py-14">
        <div className="mx-auto max-w-(--container-content) px-4 sm:px-6">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Рубрики блога">
            <TagChip active={tag === null} onClick={() => choose(null)}>
              Все · {blogEntries.length}
            </TagChip>
            {blogTags.map((item) => (
              <TagChip key={item.tag} active={tag === item.tag} onClick={() => choose(item.tag)}>
                {item.tag} · {item.total}
              </TagChip>
            ))}
          </div>

          {lead && (
            <Reveal key={`lead-${tag}`}>
              <Link
                to={`/blog/${lead.slug}`}
                className="group mt-8 grid gap-6 rounded-panel bg-white p-5 transition-shadow hover:shadow-lg hover:shadow-ink-900/10 lg:grid-cols-2 lg:gap-10 lg:p-6"
              >
                <img
                  src={thumbFor(lead, 0)}
                  alt=""
                  loading="lazy"
                  className="aspect-16/10 w-full rounded-card object-cover"
                />
                <div className="flex flex-col justify-center">
                  <Meta entry={lead} />
                  <h2 className="font-display mt-3 text-[1.75rem] text-navy-700 sm:text-[2.25rem]">
                    {lead.title}
                  </h2>
                  <p className="mt-4 leading-relaxed text-ink-500">{lead.excerpt}</p>
                  <span className="mt-6 text-sm font-medium text-brand-600 group-hover:text-brand-700">
                    Читать статью →
                  </span>
                </div>
              </Link>
            </Reveal>
          )}

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleRest.map((entry, index) => (
              <Reveal key={entry.slug} delay={(index % 3) * 80}>
                <Link
                  to={`/blog/${entry.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-panel bg-white transition-shadow hover:shadow-lg hover:shadow-ink-900/10"
                >
                  <img
                    src={thumbFor(entry, index + 1)}
                    alt=""
                    loading="lazy"
                    className="aspect-16/10 w-full object-cover"
                  />
                  <span className="flex flex-1 flex-col p-5">
                    <Meta entry={entry} />
                    <span className="mt-2 block text-lg font-semibold text-navy-700 group-hover:text-brand-600">
                      {entry.title}
                    </span>
                    <span className="mt-2 line-clamp-3 block text-sm leading-relaxed text-ink-500">
                      {entry.excerpt}
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>

          {rest.length > visibleRest.length && (
            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() => setShown((count) => count + PAGE_SIZE)}
                className="rounded-full bg-white px-7 py-3.5 text-sm font-medium text-navy-700 shadow-sm transition-colors hover:bg-ink-50"
              >
                Показать ещё · осталось {rest.length - visibleRest.length}
              </button>
            </div>
          )}
        </div>
      </section>

      <FinalCta />
    </>
  )
}

function TagChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        active ? 'bg-ink-900 text-white' : 'bg-white text-ink-600 hover:bg-ink-50'
      }`}
    >
      {children}
    </button>
  )
}

export function PostPage() {
  const { slug } = useParams<{ slug: string }>()
  const article = slug ? articles.find((candidate) => candidate.slug === slug) : undefined

  if (!article) return <NotFoundPage />

  return <ArticleContent key={article.slug} article={article} />
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

function Meta({ entry, className = '' }: { entry: BlogEntry; className?: string }) {
  return (
    <p className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-400 ${className}`}>
      <span className="rounded-full bg-brand-50 px-2.5 py-1 font-medium text-brand-700">
        {entry.tag}
      </span>
      {entry.date && (
        <>
          <span>{formatDate(entry.date)}</span>
          <span aria-hidden="true">·</span>
        </>
      )}
      <span>{entry.readingMinutes} мин чтения</span>
    </p>
  )
}

/** Page of an imported article: the head from the list, the text loaded on demand. */
function ArticleContent({ article }: { article: ArticleSummary }) {
  useSeo({
    title: article.seoTitle,
    description: article.seoDescription,
    path: `/blog/${article.slug}`,
  })

  const entry = blogEntries.find((candidate) => candidate.slug === article.slug)!
  const related = blogEntries
    .filter((candidate) => candidate.tag === article.tag && candidate.slug !== article.slug)
    .slice(0, 3)
  const more = related.length === 3 ? related : blogEntries.filter((c) => c.slug !== article.slug).slice(0, 3)

  return (
    <>
      <article className="pt-32 pb-16 lg:pt-40">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <nav aria-label="Хлебные крошки" className="text-sm text-ink-400">
            <Link to="/" className="transition-colors hover:text-ink-700">
              Главная
            </Link>
            <span aria-hidden="true" className="mx-2">
              /
            </span>
            <Link to="/blog" className="transition-colors hover:text-ink-700">
              Блог
            </Link>
            <span aria-hidden="true" className="mx-2">
              /
            </span>
            <span className="text-ink-700">{article.title}</span>
          </nav>

          <Meta entry={entry} className="mt-6" />
          <h1 className="font-display mt-3 text-[2rem] text-navy-700 sm:text-[2.75rem]">
            {article.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-500">{article.excerpt}</p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl px-4 sm:px-6">
          <img
            src={article.hasHero ? publicUrl(`blog/${article.slug}/hero.webp`) : pictureFor(article.order)}
            alt={article.hasHero ? article.heroAlt : ''}
            className="aspect-16/9 w-full rounded-panel object-cover"
          />
        </div>

        <ArticleBody slug={article.slug} />
      </article>

      <section className="pb-10 lg:pb-14">
        <div className="mx-auto max-w-(--container-content) px-4 sm:px-6">
          <h2 className="text-xl font-bold text-navy-700 sm:text-2xl">Читайте также</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {more.map((other, position) => (
              <Link
                key={other.slug}
                to={`/blog/${other.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-panel bg-white transition-shadow hover:shadow-lg hover:shadow-ink-900/10"
              >
                <img
                  src={thumbFor(other, position + 2)}
                  alt=""
                  loading="lazy"
                  className="aspect-16/10 w-full object-cover"
                />
                <span className="flex flex-1 flex-col p-5">
                  <Meta entry={other} />
                  <span className="mt-2 block font-semibold text-navy-700 group-hover:text-brand-600">
                    {other.title}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  )
}

/**
 * The article text: HTML prepared from the client's own files, so it is set
 * as markup. Links to other pages of the site go through the router instead of
 * reloading the page.
 */
function ArticleBody({ slug }: { slug: string }) {
  const navigate = useNavigate()
  const [html, setHtml] = useState<string | null>(null)

  useEffect(() => {
    let current = true
    void loadArticleBody(slug).then((text) => {
      if (current && text)
        setHtml(text.replaceAll('src="/blog/', `src="${import.meta.env.BASE_URL}blog/`))
    })
    return () => {
      current = false
    }
  }, [slug])

  const follow = (event: MouseEvent<HTMLDivElement>) => {
    const link = (event.target as HTMLElement).closest('a')
    const href = link?.getAttribute('href')
    if (!link || !href?.startsWith('/') || event.metaKey || event.ctrlKey || event.shiftKey) return
    event.preventDefault()
    navigate(href)
  }

  return (
    <div
      className="article-body mx-auto mt-12 min-h-96 max-w-3xl px-4 sm:px-6"
      onClick={follow}
      dangerouslySetInnerHTML={{ __html: html ?? '' }}
    />
  )
}
