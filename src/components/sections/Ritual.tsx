import { PlaceholderImage } from '../ui/PlaceholderImage'
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
              <PlaceholderImage
                tone="terracotta"
                ratio="1/1"
                silhouette={false}
                className="-ml-8 size-32 shrink-0 rounded-full"
                label="живой огонь в топке"
                showLabel={false}
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

          <Reveal delay={140}>
            <Cell className="flex flex-col">
              <p className="px-7 pt-7 text-center text-lg leading-snug text-ink-700">
                Работает круглый год — и в мороз тоже
              </p>
              <PlaceholderImage
                tone="dusk"
                ratio="16/10"
                className="mt-auto rounded-card"
                label="чан зимой у дома"
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
            <Cell className="flex flex-col">
              <p className="px-7 pt-7 text-center text-lg leading-snug text-ink-700">
                Одна закладка дров на весь вечер
              </p>
              <PlaceholderImage
                tone="ink"
                ratio="16/10"
                className="mt-auto rounded-card"
                label="печь с дровами"
              />
            </Cell>
          </Reveal>

          <Reveal delay={210}>
            <Cell className="flex flex-col">
              <p className="px-7 pt-7 text-center text-lg leading-snug text-ink-700">
                Нержавейка, которой не нужен особый уход
              </p>
              <PlaceholderImage
                tone="studio"
                ratio="16/10"
                className="mt-auto rounded-card"
                label="фактура нержавеющей стали"
              />
            </Cell>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Cell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`h-64 overflow-hidden rounded-panel bg-white ${className}`}>{children}</div>
  )
}
