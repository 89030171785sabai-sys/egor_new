import { photoUrl } from '../../lib/photos'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'

/**
 * Bento grid: every cell is composed differently — text only, a figure, an
 * image bleeding out of one edge. Deliberately not six identical cards.
 */
export function Ritual() {
  return (
    <section className="py-20 lg:py-28">
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
                alt="Горячая вода в чане зимой, над озером поднимается пар"
                loading="lazy"
                className="absolute inset-0 size-full object-cover"
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
                  alt="Банный чан зимой во дворе дома"
                  loading="lazy"
                  className="absolute inset-0 size-full rounded-card object-cover"
                />
              </div>
            </Cell>
          </Reveal>

          <Reveal className="h-full">
            <Cell height="h-full" className="flex flex-col justify-center px-7 py-10 text-center">
              <p className="text-lg text-ink-500">
                Как <span className="font-display text-4xl text-ink-900">баня</span>
                <span aria-hidden="true" className="ml-1 inline-block size-2 rounded-full bg-brand-500 align-super" />
                <span className="mt-1 block text-xl text-ink-700">только под небом</span>
              </p>
              <p className="mt-4 text-sm leading-relaxed text-ink-500">
                Вы дышите свежим воздухом и не перегреваете голову
              </p>
            </Cell>
          </Reveal>

          <Reveal delay={70} className="h-full">
            <Cell height="h-full" className="flex flex-col">
              <p className="px-7 pt-7 pb-4 text-center text-lg leading-snug text-ink-700">
                Одна закладка дров на весь вечер
              </p>
              <img
                src={photoUrl('ritual-stove.webp')}
                alt="Открытая топка банного чана с горящими дровами"
                loading="lazy"
                className="mt-auto aspect-16/10 w-full rounded-card object-cover"
              />
            </Cell>
          </Reveal>

          <Reveal delay={140} className="h-full">
            <Cell height="h-full" className="flex flex-col justify-center px-7 py-10 text-center">
              <p className="text-ink-700">
                <span className="text-sm text-ink-400">до</span>{' '}
                <span className="font-display text-5xl">12</span>{' '}
                <span className="text-sm text-ink-400">человек</span>
              </p>
              <p className="mt-4 text-sm leading-relaxed text-ink-500">
                Самый большой размер в линейке — для мероприятий и банных комплексов
              </p>
            </Cell>
          </Reveal>

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
