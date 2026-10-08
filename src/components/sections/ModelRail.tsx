import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { SectionHeading } from '../ui/SectionHeading'
import { ModelShot } from '../ui/ModelShot'
import { Reveal } from '../ui/Reveal'
import {
  formatPrice,
  models,
  modelSizes,
  priceFrom,
  modelPriceFrom,
  sizeTier,
  sizeTiers,
  type Model,
  type SizeCm,
} from '../../data/models'

/**
 * The line as a row of tiles that scrolls sideways.
 *
 * The home page is not where someone compares kit lists — that is what the
 * catalogue page is for, and its cards carry the full detail. Here the job is
 * to show that there are seven of them and let a visitor pick one, so each
 * tile is the photograph, the name, the sizes it comes in and the two things
 * to do next. The row runs off the edge of the screen on purpose: a partly
 * visible tile is what says it can be swiped.
 */
export function ModelRail() {
  const [size, setSize] = useState<SizeCm | 'all'>('all')

  const shown = useMemo(
    () => (size === 'all' ? models : models.filter((model) => modelSizes(model).includes(size))),
    [size],
  )

  const rail = useRef<HTMLDivElement>(null)
  const [reach, setReach] = useState({ back: false, on: false })

  // Which way there is still room to go, so an arrow is only offered when it
  // would do something.
  const measure = useCallback(() => {
    const node = rail.current
    if (!node) return
    const slack = node.scrollWidth - node.clientWidth
    setReach({
      back: node.scrollLeft > 8,
      on: slack > 8 && node.scrollLeft < slack - 8,
    })
  }, [])

  useEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure, shown])

  const step = (direction: 1 | -1) => {
    const node = rail.current
    if (!node) return
    const tile = node.querySelector('li')
    const by = (tile?.clientWidth ?? 280) + 20
    node.scrollBy({ left: direction * by, behavior: 'smooth' })
  }

  return (
    <section id="catalog" className="scroll-mt-28 py-20 lg:py-28">
      <div className="mx-auto max-w-(--container-content) px-4 sm:px-6">
        <SectionHeading
          eyebrow="Каталог"
          title="Серии чанов HOTTUB"
          subtitle={`Семь моделей: своя печь, своё время нагрева и своя марка стали. Цены от ${formatPrice(priceFrom)} за полный комплект — итоговую считаем под ваш участок.`}
          align="center"
        />

        <div
          role="radiogroup"
          aria-label="Фильтр по размеру чаши"
          className="mt-8 flex flex-wrap justify-center gap-2"
        >
          <FilterChip active={size === 'all'} onClick={() => setSize('all')}>
            Все размеры
          </FilterChip>
          {sizeTiers.map((tier) => (
            <FilterChip key={tier.cm} active={size === tier.cm} onClick={() => setSize(tier.cm)}>
              до {tier.people}
              <PersonIcon />
            </FilterChip>
          ))}
        </div>

        {/*
         * The row runs wider than the column and scrolls inside it, so the
         * tile at the end is cut rather than wrapped — a partly visible tile
         * is what tells someone the row goes on. A phone is pushed along with
         * a thumb; a mouse has no sideways wheel to do it with, so the two
         * arrows sit over the ends of the row and each take it one tile.
         */}
        <div className="relative mt-10">
          <div
            ref={rail}
            onScroll={measure}
            className="overflow-x-auto overscroll-x-contain pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <ul className="flex w-max snap-x snap-mandatory gap-5">
              {shown.map((model, index) => (
                <li key={model.slug} className="w-80 shrink-0 snap-start sm:w-96">
                  <Reveal className="h-full" delay={Math.min(index, 3) * 70}>
                    <RailCard model={model} />
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>

          <Step side="back" show={reach.back} onClick={() => step(-1)} />
          <Step side="on" show={reach.on} onClick={() => step(1)} />
        </div>

        {shown.length === 0 && (
          <p className="mt-10 rounded-panel bg-white p-8 text-center text-ink-500">
            В этом размере готовых моделей нет — сделаем под заказ. Оставьте заявку, посчитаем.
          </p>
        )}
      </div>
    </section>
  )
}

function RailCard({ model }: { model: Model }) {
  const sizes = modelSizes(model)
  const from = modelPriceFrom(model)

  return (
    <article className="flex h-full flex-col">
      <Link
        to={`/${model.slug}`}
        className="relative block overflow-hidden rounded-panel bg-white transition-shadow hover:shadow-lg hover:shadow-ink-900/10"
      >
        <Loupe>
          <ModelShot model={model} slot="card" ratio="10/9" />
        </Loupe>
        {model.badge && (
          <span className="absolute top-3 left-3 rounded-full bg-brand-500 px-3 py-1 text-xs font-semibold text-white">
            {model.badge}
          </span>
        )}
      </Link>

      <h3 className="mt-5 text-center text-xl font-bold tracking-tight text-navy-700 uppercase">
        {model.name}
      </h3>
      <p className="mt-1 text-center text-xs text-ink-400">{model.accent}</p>

      <ul className="mt-3 flex flex-wrap justify-center gap-1.5">
        {sizes.map((cm) => (
          <li
            key={cm}
            className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs text-ink-600 ring-1 ring-sand-300"
          >
            {cm} см · до {sizeTier(cm)?.people}
            <PersonIcon />
          </li>
        ))}
      </ul>

      <p className="mt-3 text-center text-sm font-semibold">от {formatPrice(from)}</p>

      <div className="mt-auto flex flex-col items-center gap-2.5 pt-4">
        <Link
          to={`/${model.slug}`}
          className="w-full rounded-full bg-ink-900 px-5 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-ink-800"
        >
          Смотреть
        </Link>
        <Link
          to="/calculator"
          className="text-sm text-ink-500 transition-colors hover:text-brand-600"
        >
          Расчёт цены →
        </Link>
      </div>
    </article>
  )
}

/**
 * Magnifies whatever the pointer is over.
 *
 * The shots are of a whole product, so the welds, the larch and the firebox
 * are all small in them; leaning in is how someone reads build quality. The
 * zoom grows under the pointer rather than from the middle, so the part being
 * looked at is the part that gets bigger.
 *
 * The origin is written straight to the node on each move. Routing it through
 * state would re-render the whole rail on every mouse event, and the property
 * is deliberately left out of the transition so the picture follows the
 * pointer instead of chasing it.
 */
/**
 * One of the two arrows over the ends of the row.
 *
 * Sat against the tiles rather than beside the heading: that is where the
 * row is cut off, so that is where someone looks for the way on. It fades
 * out rather than disappearing when the row runs out, so the arrows do not
 * shift the layout as the row moves.
 */
function Step({
  side,
  show,
  onClick,
}: {
  side: 'back' | 'on'
  show: boolean
  onClick: () => void
}) {
  const back = side === 'back'
  return (
    <button
      type="button"
      onClick={onClick}
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
      aria-label={back ? 'Предыдущие модели' : 'Следующие модели'}
      // Lined up with the middle of the photograph, not of the whole tile,
      // which carries a name, chips, a price and two actions below it. Kept
      // off the phone, where the row is pushed along with a thumb and the
      // buttons would only sit on top of the tiles.
      className={`absolute top-[29%] hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-white text-ink-700 shadow-lg shadow-ink-900/15 transition-opacity hover:text-brand-600 sm:grid ${
        back ? '-left-2 sm:-left-5' : '-right-2 sm:-right-5'
      } ${show ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className={`size-5 ${back ? 'rotate-180' : ''}`}>
        <path
          d="m9 5 7 7-7 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

function Loupe({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  const follow = (event: MouseEvent<HTMLDivElement>) => {
    const node = ref.current
    if (!node) return
    const bounds = node.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width) * 100
    const y = ((event.clientY - bounds.top) / bounds.height) * 100
    node.style.transformOrigin = `${x}% ${y}%`
  }

  return (
    <div
      ref={ref}
      onMouseMove={follow}
      className="transition-transform duration-300 ease-out [@media(hover:hover)]:hover:scale-[1.75]"
    >
      {children}
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm transition-colors ${
        active
          ? 'bg-ink-800 text-white'
          : 'bg-white text-ink-600 ring-1 ring-sand-300 hover:bg-sand-200'
      }`}
    >
      {children}
    </button>
  )
}

function PersonIcon() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" className="size-3 opacity-70">
      <circle cx="6" cy="3.5" r="1.9" fill="currentColor" />
      <path d="M2 11c0-2.2 1.8-4 4-4s4 1.8 4 4" fill="currentColor" />
    </svg>
  )
}
