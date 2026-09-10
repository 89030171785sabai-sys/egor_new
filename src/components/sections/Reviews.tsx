import { SectionHeading } from '../ui/SectionHeading'
import { Slider } from '../ui/Slider'
import { reviews } from '../../data/reviews'
import { modelBySlug } from '../../data/models'

/** Renders nothing until real reviews are supplied. */
export function Reviews() {
  if (reviews.length === 0) return null

  return (
    <section id="reviews" className="scroll-mt-28 overflow-hidden py-20 lg:py-28">
      <div className="mx-auto max-w-(--container-content) px-4 sm:px-6">
        <SectionHeading
          eyebrow="Отзывы"
          title="Что говорят владельцы"
          subtitle="Отзывы тех, у кого чан уже стоит на участке."
        />
      </div>

      <Slider label="Отзывы владельцев" className="mt-12">
        {reviews.map((review) => {
          const model = review.modelSlug ? modelBySlug(review.modelSlug) : undefined

          return (
            <blockquote
              key={`${review.author}-${review.text.slice(0, 24)}`}
              className="w-[85vw] shrink-0 snap-start rounded-panel bg-white p-6 first:ml-4 last:mr-4 sm:w-[26rem] sm:first:ml-6 sm:last:mr-6"
            >
              <p className="text-sm leading-relaxed text-ink-700">{review.text}</p>
              <footer className="mt-5 border-t border-sand-200 pt-4 text-sm">
                <cite className="font-semibold not-italic">{review.author}</cite>
                <p className="mt-1 text-ink-400">
                  {[review.city, model?.name, review.date].filter(Boolean).join(' · ')}
                </p>
                {review.source && <p className="mt-1 text-xs text-ink-300">{review.source}</p>}
              </footer>
            </blockquote>
          )
        })}
      </Slider>
    </section>
  )
}
