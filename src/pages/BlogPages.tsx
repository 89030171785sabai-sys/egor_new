import { Link, useParams } from 'react-router-dom'
import { NotFoundPage } from './NotFoundPage'
import { PageHeader } from '../components/ui/PageHeader'
import { PlaceholderImage } from '../components/ui/PlaceholderImage'
import { Reveal } from '../components/ui/Reveal'
import { FinalCta } from '../components/sections/FinalCta'
import { useSeo } from '../lib/seo'
import { formatPostDate, postBySlug, posts, sortedPosts, type Post } from '../data/posts'

const tones = ['dusk', 'graphite', 'copper', 'olive', 'ink', 'terracotta'] as const

/** Keeps a post's illustration stable across renders and pages. */
const toneFor = (index: number) => tones[index % tones.length]

export function BlogPage() {
  useSeo({
    title: 'Блог о банных чанах',
    description:
      'Как выбрать размер чана, сколько нужно дров, как ухаживать за нержавейкой и готовить площадку под установку.',
    path: '/blog',
  })

  const [lead, ...rest] = sortedPosts

  return (
    <>
      <PageHeader
        title="Блог"
        tone="olive"
        photo="чан на участке, общий план"
        lead="Пишем о том, о чём нас спрашивают: как выбрать размер, чем топить, как ухаживать и что подготовить к доставке."
      />

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-(--container-content) px-4 sm:px-6">
          {lead && (
            <Reveal>
              <Link
                to={`/blog/${lead.slug}`}
                className="group grid gap-6 rounded-panel bg-white p-5 transition-shadow hover:shadow-lg hover:shadow-ink-900/10 lg:grid-cols-2 lg:gap-10 lg:p-6"
              >
                <PlaceholderImage
                  tone={toneFor(0)}
                  ratio="16/10"
                  className="rounded-card"
                  label={lead.title}
                  showLabel={false}
                />
                <div className="flex flex-col justify-center">
                  <Meta post={lead} />
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
            {rest.map((post, index) => (
              <Reveal key={post.slug} delay={(index % 3) * 80}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-panel bg-white transition-shadow hover:shadow-lg hover:shadow-ink-900/10"
                >
                  <PlaceholderImage
                    tone={toneFor(index + 1)}
                    ratio="16/10"
                    label={post.title}
                    showLabel={false}
                  />
                  <span className="flex flex-1 flex-col p-5">
                    <Meta post={post} />
                    <span className="mt-2 block text-lg font-semibold text-navy-700 group-hover:text-brand-600">
                      {post.title}
                    </span>
                    <span className="mt-2 block text-sm leading-relaxed text-ink-500">
                      {post.excerpt}
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  )
}

export function PostPage() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? postBySlug(slug) : undefined

  if (!post) return <NotFoundPage />

  return <PostContent post={post} />
}

function PostContent({ post }: { post: Post }) {
  useSeo({ title: post.seoTitle, description: post.seoDescription, path: `/blog/${post.slug}` })

  const others = sortedPosts.filter((candidate) => candidate.slug !== post.slug).slice(0, 3)
  const index = posts.findIndex((candidate) => candidate.slug === post.slug)

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
            <span className="text-ink-700">{post.title}</span>
          </nav>

          <Meta post={post} className="mt-6" />
          <h1 className="font-display mt-3 text-[2rem] text-navy-700 sm:text-[2.75rem]">
            {post.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-500">{post.excerpt}</p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl px-4 sm:px-6">
          <PlaceholderImage
            tone={toneFor(index)}
            ratio="16/9"
            className="rounded-panel"
            label={`иллюстрация к статье «${post.title}»`}
          />
        </div>

        <div className="mx-auto mt-12 max-w-3xl px-4 sm:px-6">
          {post.sections.map((section) => (
            <section key={section.heading} className="mt-10 first:mt-0">
              <h2 className="text-xl font-bold text-navy-700 sm:text-2xl">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="mt-4 leading-relaxed text-ink-600">
                  {paragraph}
                </p>
              ))}
              {section.list && (
                <ul className="mt-4 space-y-2">
                  {section.list.map((item) => (
                    <li key={item} className="flex items-start gap-3 leading-relaxed text-ink-600">
                      <span
                        aria-hidden="true"
                        className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand-500"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </article>

      {others.length > 0 && (
        <section className="pb-20 lg:pb-28">
          <div className="mx-auto max-w-(--container-content) px-4 sm:px-6">
            <h2 className="text-xl font-bold text-navy-700 sm:text-2xl">Читайте также</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {others.map((other, position) => (
                <Link
                  key={other.slug}
                  to={`/blog/${other.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-panel bg-white transition-shadow hover:shadow-lg hover:shadow-ink-900/10"
                >
                  <PlaceholderImage
                    tone={toneFor(position + 2)}
                    ratio="16/10"
                    label={other.title}
                    showLabel={false}
                  />
                  <span className="flex flex-1 flex-col p-5">
                    <Meta post={other} />
                    <span className="mt-2 block font-semibold text-navy-700 group-hover:text-brand-600">
                      {other.title}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <FinalCta />
    </>
  )
}

function Meta({ post, className = '' }: { post: Post; className?: string }) {
  return (
    <p className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-400 ${className}`}>
      <span className="rounded-full bg-brand-50 px-2.5 py-1 font-medium text-brand-700">
        {post.tag}
      </span>
      <span>{formatPostDate(post.date)}</span>
      <span aria-hidden="true">·</span>
      <span>{post.readingMinutes} мин чтения</span>
    </p>
  )
}
