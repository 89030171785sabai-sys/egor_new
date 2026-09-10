import { Link } from 'react-router-dom'
import { ButtonLink } from './Button'
import { PlaceholderImage } from './PlaceholderImage'
import { formatHours, formatPriceRange, type Model } from '../../data/models'

/**
 * Catalogue card: name, accent line, product shot with the heating badge, kit
 * contents, price and the call to action.
 */
export function ModelCard({ model }: { model: Model }) {
  return (
    <article className="flex flex-col rounded-panel bg-white p-5 shadow-sm shadow-ink-900/5 transition-shadow hover:shadow-lg hover:shadow-ink-900/10 sm:p-6">
      <h3 className="text-xl font-bold tracking-tight text-navy-700 uppercase">{model.name}</h3>
      <p className="mt-2 flex items-start gap-2 text-xs font-semibold tracking-wide text-brand-500 uppercase">
        <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-500" />
        {model.accent}
      </p>

      <div className="relative mt-5 overflow-hidden rounded-card">
        <PlaceholderImage tone="studio" ratio="4/3" label={`${model.name} — товарное фото`} />
        <span className="absolute top-3 right-3 rounded-full bg-brand-500 px-3.5 py-1.5 text-sm font-semibold text-white">
          Нагрев {formatHours(model.heatingHours)}
        </span>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-ink-500">{model.description}</p>

      <p className="mt-5 text-sm font-semibold">что входит:</p>
      <ul className="mt-3 space-y-2.5">
        {model.includes.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm">
            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-600">
              <svg viewBox="0 0 12 12" aria-hidden="true" className="size-2.5">
                <path
                  d="m2 6.4 2.6 2.6L10 3.4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-6 border-t border-sand-200 pt-5">
        <p className="text-xs tracking-wider text-ink-400 uppercase">Цена</p>
        <p className="mt-1 text-xl font-bold">{formatPriceRange(model.price)}</p>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <ButtonLink to="/#contacts" size="lg" className="flex-1">
          Обсудить детали
        </ButtonLink>
        <Link
          to={`/${model.slug}`}
          className="text-sm font-medium text-ink-600 transition-colors hover:text-brand-600"
        >
          Подробнее о модели →
        </Link>
      </div>
    </article>
  )
}
