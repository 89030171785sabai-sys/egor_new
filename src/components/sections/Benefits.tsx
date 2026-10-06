import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { PlaceholderImage } from '../ui/PlaceholderImage'
import { photoUrl } from '../../lib/photos'
import { benefits, type Benefit } from '../../data/benefits'

/**
 * The technical advantages, drawn rather than photographed.
 *
 * Each drawing sits in silver and comes to colour under the pointer — the same
 * treatment the stove close-ups use, so the two read as one language. Where no
 * pointer exists, the colour take is simply shown.
 */
export function Benefits() {
  return (
    <section id="benefits" className="scroll-mt-28 bg-sand-100 py-20 lg:py-28">
      <div className="mx-auto max-w-(--container-content) px-4 sm:px-6">
        <SectionHeading
          eyebrow="Преимущества"
          title="Почему чан греется быстрее"
          subtitle="Три вещи решают всё: толщина стали, устройство водяного контура и площадь, которой печь отдаёт тепло воде."
        />

        <ul className="mt-12 grid gap-6 lg:grid-cols-2">
          {benefits.map((benefit, index) => (
            <li key={benefit.id}>
              <Reveal delay={(index % 2) * 90} className="h-full">
                <article className="group flex h-full flex-col overflow-hidden rounded-panel bg-white sm:flex-row sm:items-center">
                  <div className="shrink-0 sm:order-last sm:w-2/5">
                    <BenefitDrawing benefit={benefit} />
                  </div>

                  <div className="p-6 sm:p-7">
                    <h3 className="text-lg leading-snug font-semibold text-navy-700">
                      {benefit.title}
                    </h3>

                    {benefit.lead && (
                      <p className="mt-3 text-sm leading-relaxed text-ink-500">{benefit.lead}</p>
                    )}

                    {benefit.points && (
                      <ul className="mt-4 space-y-2.5">
                        {benefit.points.map((point) => (
                          <li key={point} className="flex items-start gap-2.5 text-sm">
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
                            {point}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function BenefitDrawing({ benefit }: { benefit: Benefit }) {
  const { image, title, wanted } = benefit

  if (!image) {
    return (
      <PlaceholderImage tone="studio" ratio="4/3" label={`Схема: ${wanted}`} />
    )
  }

  if (!image.grey) {
    return (
      <img
        src={photoUrl(image.color)}
        alt={title}
        loading="lazy"
        className="aspect-4/3 w-full bg-white object-contain transition duration-500 motion-reduce:transition-none [@media(hover:hover)]:grayscale [@media(hover:hover)]:group-hover:grayscale-0"
      />
    )
  }

  return (
    <span className="relative block aspect-4/3 w-full bg-white">
      <img
        src={photoUrl(image.grey)}
        alt=""
        loading="lazy"
        aria-hidden="true"
        className="absolute inset-0 size-full object-contain opacity-0 [@media(hover:hover)]:opacity-100"
      />
      <img
        src={photoUrl(image.color)}
        alt={title}
        loading="lazy"
        className="absolute inset-0 size-full object-contain transition-opacity duration-500 motion-reduce:transition-none [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
      />
    </span>
  )
}
