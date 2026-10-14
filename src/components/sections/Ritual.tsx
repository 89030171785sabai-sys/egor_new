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
          <Reveal>
            <Cell className="flex items-center gap-5 pr-6">
              <img
                src={photoUrl('ritual-ambience.webp')}
                alt="Пар над водой чана, дольки апельсина и еловые ветки"
                loading="lazy"
                className="-ml-8 size-40 shrink-0 rounded-full object-cover"
              />
              <p className="text-lg leading-snug text-ink-700">
                Живой огонь и вода — вместо кафеля и таймера
              </p>
            </Cell>
          </Reveal>

          <Reveal delay={70}>
            <Cell className="flex flex-col justify-center px-7 text-center">
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

          <Reveal delay={140} className="sm:row-span-2">
            <Cell height="h-full" className="flex flex-col">
              <p className="px-7 pt-7 text-center text-lg leading-snug text-ink-700">
                Работает круглый год — и в мороз тоже
              </p>
              {/*
                * Снимок вертикальный (соотношение 0.83), поэтому карточка
                * здесь растёт по содержимому, а не держит общие 256px: в
                * окне 4/5 кадр виден целиком по высоте — и чан, и двор со
                * снегом. В широкой полосе от него оставалась половина.
                */}
              <img
                src={photoUrl('ritual-winter.webp')}
                alt="Банный чан зимой во дворе дома"
                loading="lazy"
                className="mt-auto aspect-4/5 w-full rounded-card object-cover"
              />
            </Cell>
          </Reveal>

          <Reveal delay={70}>
            <Cell className="flex flex-col justify-center px-7">
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

          <Reveal delay={140}>
            <Cell height="h-auto" className="flex flex-col">
              <p className="px-7 pt-7 text-center text-lg leading-snug text-ink-700">
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

          <Reveal delay={210} className="sm:col-span-2 lg:col-span-3">
            <Cell height="h-auto" className="flex flex-col">
              <p className="px-7 pt-7 text-center text-lg leading-snug text-ink-700">
                Нержавейка, которой не нужен особый уход
              </p>
              {/* Фактура — материал, а не сюжет: полосой во всю ширину она
                  читается лучше и закрывает последний ряд сетки. */}
              <img
                src={photoUrl('ritual-steel.webp')}
                alt="Фактура шлифованной нержавеющей стали"
                loading="lazy"
                className="mt-auto h-24 w-full rounded-card object-cover"
              />
            </Cell>
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
