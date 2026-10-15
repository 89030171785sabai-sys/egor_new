import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { photoUrl } from '../../lib/photos'

/** Opening band of an inner page: breadcrumbs, title and a short lead. */
export function PageHeader({
  title,
  lead,
  breadcrumb,
  image,
  children,
}: {
  title: string
  lead?: ReactNode
  /** Label of the current page in the breadcrumb trail. */
  breadcrumb?: string
  /** Backdrop photograph, by file name in `public/photos`. */
  image: string
  /** Figures or chips shown under the lead. */
  children?: ReactNode
}) {
  return (
    <section className="relative isolate overflow-hidden pt-32 pb-16 lg:pt-40 lg:pb-20">
      <img
        src={photoUrl(image)}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-20 size-full object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink-900/65" />

      <div className="relative mx-auto max-w-(--container-content) px-4 sm:px-6">
        <nav aria-label="Хлебные крошки" className="text-sm text-white/60">
          <Link to="/" className="transition-colors hover:text-white">
            Главная
          </Link>
          <span aria-hidden="true" className="mx-2">
            /
          </span>
          <span className="text-white/90">{breadcrumb ?? title}</span>
        </nav>

        <h1 className="font-display mt-6 max-w-3xl text-[2.25rem] text-white sm:text-[3rem] lg:text-[3.5rem]">
          {title}
        </h1>

        {lead && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">{lead}</p>
        )}

        {children && <div className="mt-10">{children}</div>}

      </div>
    </section>
  )
}

/** Row of figures used under a page title. */
export function PageFigures({
  items,
}: {
  items: Array<{ value: string; unit?: string; caption: string }>
}) {
  return (
    <dl className="grid gap-px overflow-hidden rounded-panel bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.caption} className="bg-ink-900/60 px-6 py-5">
          <dt className="sr-only">{item.caption}</dt>
          <dd>
            <span className="font-display text-3xl text-white">{item.value}</span>
            {item.unit && <span className="ml-1 text-sm text-white/60">{item.unit}</span>}
            <p className="mt-1 text-sm text-white/60">{item.caption}</p>
          </dd>
        </div>
      ))}
    </dl>
  )
}
