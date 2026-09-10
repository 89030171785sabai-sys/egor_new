import { Link } from 'react-router-dom'
import { NotFoundPage } from './NotFoundPage'
import { useSeo } from '../lib/seo'
import { legalBySlug, type LegalDocument } from '../data/legal'
import { legalRoutes } from '../lib/routes'
import { contacts } from '../data/contacts'

export function LegalPage({ slug }: { slug: string }) {
  const document = legalBySlug(slug)
  if (!document) return <NotFoundPage />

  const route = legalRoutes.find((item) => item.path === `/${slug}`)

  return <LegalContent document={document} description={route?.description ?? document.intro} />
}

function LegalContent({
  document,
  description,
}: {
  document: LegalDocument
  description: string
}) {
  useSeo({
    title: document.title,
    description,
    path: `/${document.slug}`,
    // Legal boilerplate has no business competing in search results.
    robots: 'noindex, follow',
  })

  return (
    <article className="mx-auto max-w-3xl px-4 pt-32 pb-20 sm:px-6 lg:pt-40">
      <nav aria-label="Хлебные крошки" className="text-sm text-ink-400">
        <Link to="/" className="transition-colors hover:text-ink-700">
          Главная
        </Link>
        <span aria-hidden="true" className="mx-2">
          /
        </span>
        <span className="text-ink-700">{document.title}</span>
      </nav>

      <h1 className="font-display mt-6 text-3xl uppercase sm:text-4xl">{document.title}</h1>
      <p className="mt-3 text-sm text-ink-400">Редакция от {document.updated}</p>
      <p className="mt-6 leading-relaxed text-ink-600">{document.intro}</p>

      {document.sections.map((section, index) => (
        <section key={section.heading} className="mt-10">
          <h2 className="text-xl font-bold">
            <span className="mr-2 text-brand-500">{index + 1}.</span>
            {section.heading}
          </h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)} className="mt-4 leading-relaxed text-ink-600">
              {paragraph}
            </p>
          ))}
          {section.items && (
            <ul className="mt-4 space-y-2">
              {section.items.map((item) => (
                <li key={item} className="flex items-start gap-3 leading-relaxed text-ink-600">
                  <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand-500" />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <footer className="mt-14 rounded-panel bg-white p-6 text-sm leading-relaxed text-ink-500">
        <p className="font-semibold text-ink-800">Оператор</p>
        <p className="mt-2">
          {contacts.legal.entity}, ИНН {contacts.legal.inn}
        </p>
        <p className="mt-1">
          {contacts.email} · {contacts.phone.display}
        </p>
      </footer>
    </article>
  )
}
