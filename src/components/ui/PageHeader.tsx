import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { PlaceholderImage, type PlaceholderTone } from './PlaceholderImage'

/** Opening band of an inner page: breadcrumbs, title and a short lead. */
export function PageHeader({
  title,
  lead,
  breadcrumb,
  tone = 'dusk',
  photo,
  children,
}: {
  title: string
  lead?: ReactNode
  /** Label of the current page in the breadcrumb trail. */
  breadcrumb?: string
  /** Backdrop tone of the stand-in shot. */
  tone?: PlaceholderTone
  /** Which photograph belongs here, named on the stand-in marker. */
  photo: string
  /** Figures or chips shown under the lead. */
  children?: ReactNode
}) {
  return (
    <section className="relative isolate overflow-hidden pt-32 pb-16 lg:pt-40 lg:pb-20">
      <PlaceholderImage
        tone={tone}
        ratio="auto"
        silhouette={false}
        className="absolute inset-0 -z-20 size-full"
        label={photo}
        showLabel={false}
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink-900/60" />

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

        <PlaceholderNote photo={photo} />
      </div>
    </section>
  )
}

/**
 * Visible marker that the backdrop is a stand-in. It names the photograph the
 * slot expects, so the swap does not get forgotten — remove this component
 * once real photography is in place.
 */
export function PlaceholderNote({ photo }: { photo: string }) {
  return (
    <p className="mt-10 inline-flex items-center gap-2 rounded-full bg-brand-500/90 px-4 py-2 text-xs font-medium text-white">
      <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5">
        <path
          d="M8 1.5 15 14H1L8 1.5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path d="M8 6.5v3.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="8" cy="11.6" r="0.7" fill="currentColor" />
      </svg>
      Заглушка вместо фотографии: {photo}
    </p>
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
