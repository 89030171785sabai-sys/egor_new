import { Link } from 'react-router-dom'
import { photoUrl } from '../../lib/photos'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'

/**
 * Bento grid: every cell is composed differently — text only, a figure, an
 * image bleeding out of one edge. Deliberately not six identical cards.
 */
export function Ritual() {
  return (
    <section className="py-10 lg:py-14">
      <div className="mx-auto max-w-(--container-content) px-4 sm:px-6">
        <SectionHeading
          title={
            <>
              Чан — это <span className="text-ink-400">про отдых</span>
            </>
          }
          subtitle="Горячая вода под открытым небом, живой огонь и компания рядом. Ради этого его и ставят."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Кадр целиком, подпись поверх него: так снимок работает сам, без рамки. */}
          <Reveal className="h-full sm:col-span-2">
            <div className="relative aspect-4/3 overflow-hidden rounded-panel bg-ink-900 lg:aspect-auto lg:h-full lg:min-h-[34rem]">
              <img
                src={photoUrl('ritual-water.webp')}
                alt="Банный чан рядом с сауной на берегу зимнего озера"
                loading="lazy"
                className="absolute inset-0 size-full object-cover object-[50%_35%]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-900/75 to-transparent px-7 pt-24 pb-7">
                <p className="max-w-md text-xl leading-snug text-white lg:text-2xl">
                  Живой огонь и вода — вместо кафеля и таймера
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={70} className="h-full">
            <Cell height="h-auto lg:h-full" className="flex flex-col">
              <p className="px-7 pt-7 text-center text-lg leading-snug text-ink-700">
                Работает круглый год — и в мороз тоже
              </p>
              {/*
                * Снимок вертикальный: на узком экране он идёт в своих
                * пропорциях, а в ряду с озером растягивается на оставшуюся
                * высоту карточки — кадр виден почти целиком.
                */}
              <div className="relative mt-4 aspect-4/5 w-full lg:aspect-auto lg:min-h-0 lg:flex-1">
                <img
                  src={photoUrl('ritual-winter.webp')}
                  alt="Четверо отдыхают в банном чане во время снегопада"
                  loading="lazy"
                  className="absolute inset-0 size-full rounded-card object-cover object-[50%_60%]"
                />
              </div>
            </Cell>
          </Reveal>

          <div className="grid gap-5 sm:col-span-2 md:grid-cols-3 lg:col-span-3">
            <RitualLink to="/catalog">
              <div className="flex flex-1 flex-col justify-center px-6 py-9 lg:px-8">
                <svg
                  viewBox="0 0 48 48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                  className="mb-6 size-12 text-brand-600"
                >
                  <path d="M6 18h23a5 5 0 1 0-5-5M6 25h32a4 4 0 1 0-4-4M10 32h15a5 5 0 1 1-5 5" />
                </svg>
                <h3 className="font-display text-3xl leading-tight text-ink-900 lg:text-4xl">
                  Как баня,<br />только под небом
                </h3>
                <p className="mt-4 max-w-[27ch] text-sm leading-relaxed text-ink-600">
                  Горячая вода и свежий воздух. Поставьте чан во дворе или на террасе.
                </p>
              </div>
              <RitualAction>Выбрать чан</RitualAction>
            </RitualLink>

            <RitualLink to="/cherny-brilliant">
              <h3 className="px-5 pt-6 pb-4 text-center text-lg font-medium leading-snug text-ink-900">
                Одна закладка дров на весь вечер
              </h3>
              <div className="relative flex-1 overflow-hidden rounded-card">
                <img
                  src={photoUrl('ritual-stove.webp')}
                  alt="Банный чан «Чёрный бриллиант» с лестницей и дымоходом на заснеженном участке"
                  loading="lazy"
                  className="absolute inset-0 size-full object-cover object-[50%_78%] motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.03] motion-safe:group-focus-visible:scale-[1.03]"
                />
              </div>
              <RitualAction>Смотреть «Чёрный бриллиант»</RitualAction>
            </RitualLink>

            <RitualLink to="/grant">
              <div className="flex flex-1 flex-col justify-center px-6 py-9 lg:px-8">
                <h3 className="font-display text-3xl leading-tight text-ink-900 lg:text-4xl">
                  Для большой<br />компании
                </h3>
                <p className="mt-5 flex items-baseline gap-2 text-ink-600">
                  <span>до</span>
                  <span className="font-display text-6xl leading-none text-ink-900">14</span>
                  <span>человек</span>
                </p>
                <p className="mt-4 max-w-[27ch] text-sm leading-relaxed text-ink-600">
                  Чан «Грант» диаметром 250 см для встреч с друзьями и банных комплексов.
                </p>
              </div>
              <RitualAction>Смотреть «Грант»</RitualAction>
            </RitualLink>
          </div>

          {/* Фактура — фон карточки, а не отдельная серая полоса: текст стоит на самом материале. */}
          <Reveal delay={210} className="sm:col-span-2 lg:col-span-3">
            <div className="relative overflow-hidden rounded-panel bg-ink-100">
              <img
                src={photoUrl('ritual-steel.webp')}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="absolute inset-0 size-full object-cover"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-white/40" />
              <div className="relative flex flex-col items-start justify-between gap-4 px-8 py-10 sm:flex-row sm:items-center lg:px-12">
                <p className="max-w-md text-xl leading-snug text-ink-900 lg:text-2xl">
                  Нержавейка, которой не нужен особый уход
                </p>
                <p className="font-display text-4xl text-ink-900 lg:text-5xl">AISI 304</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function RitualLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="group flex min-h-[30rem] flex-col overflow-hidden rounded-panel bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500 motion-safe:transition-[transform,box-shadow] motion-safe:duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-lg motion-safe:focus-visible:-translate-y-0.5 md:min-h-[27rem] lg:min-h-[34rem]"
    >
      {children}
    </Link>
  )
}

function RitualAction({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center justify-between gap-3 border-t border-sand-200 px-6 py-4 text-sm font-semibold text-ink-900 lg:px-8">
      {children}
      <svg
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="size-4 shrink-0 text-brand-600 motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-focus-visible:translate-x-0.5"
      >
        <path d="M3.5 10h12m-5-5 5 5-5 5" />
      </svg>
    </span>
  )
}

function Cell({
  children,
  className = '',
  height = 'h-64',
}: {
  children: React.ReactNode
  className?: string
  /** Cells are one height by default; a portrait photograph needs its own. */
  height?: string
}) {
  return (
    <div className={`${height} overflow-hidden rounded-panel bg-white ${className}`}>{children}</div>
  )
}
