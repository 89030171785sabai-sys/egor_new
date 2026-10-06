import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { PlaceholderImage } from '../ui/PlaceholderImage'
import { Logo } from '../ui/Logo'
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

        <ul className="mt-12 grid gap-6">
          {benefits.map((benefit, index) => (
            <li key={benefit.id}>
              <Reveal delay={(index % 2) * 90} className="h-full">
                <article className="group flex h-full flex-col overflow-hidden rounded-panel bg-white md:flex-row md:items-center">
                  <div className="shrink-0 md:order-last md:w-1/2 lg:w-[55%]">
                    <BenefitDrawing benefit={benefit} />
                  </div>

                  <div className="p-6 sm:p-8 lg:p-10">
                    <h3 className="text-xl leading-snug font-semibold text-navy-700 sm:text-2xl">
                      {benefit.title}
                    </h3>

                    {benefit.lead && (
                      <p className="mt-4 leading-relaxed text-ink-500">{benefit.lead}</p>
                    )}

                    {benefit.points && (
                      <ul className="mt-5 space-y-3">
                        {benefit.points.map((point) => (
                          <li key={point} className="flex items-start gap-3">
                            <span className="mt-0.5 grid size-5.5 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-600">
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

  // Everything in this slot sits in silver and comes to colour under the
  // pointer, whether it is a render or drawn here.
  const skin =
    'relative block w-full bg-white transition duration-500 motion-reduce:transition-none [@media(hover:hover)]:grayscale [@media(hover:hover)]:group-hover:grayscale-0'

  if (!image) {
    if (benefit.id === 'heat-area') {
      return (
        <span className={`${skin} aspect-4/3`}>
          <HeatAreaDiagram />
        </span>
      )
    }
    return <PlaceholderImage tone="studio" ratio="4/3" label={`Схема: ${wanted}`} />
  }

  return (
    <span className={skin} style={{ aspectRatio: `${image.width} / ${image.height}` }}>
      <img
        src={photoUrl(image.color)}
        alt={title}
        loading="lazy"
        className="absolute inset-0 size-full object-contain"
      />
      {image.arrows === 'circuit' && (
        <CirculationArrows height={(image.height / image.width) * 100} />
      )}
    </span>
  )
}

/**
 * Heat-exchange area, as the catalogue argues it: our stove's working surface
 * against an ordinary tub's. Drawn here rather than generated — it is two
 * circles and some type, which vector does exactly and an image only
 * approximately.
 */
function HeatAreaDiagram() {
  return (
    <span className="absolute inset-0 grid place-items-center p-4">
      <svg viewBox="0 0 400 320" className="size-full" role="img"
        aria-label="Площадь поверхности печи HOTTUB против обычного чана">
        <defs>
          <radialGradient id="heat-area-fill" cx="42%" cy="34%" r="78%">
            <stop offset="0%" stopColor="var(--color-brand-400)" />
            <stop offset="100%" stopColor="var(--color-brand-600)" />
          </radialGradient>
          <path id="heat-area-arc" fill="none"
            d="M58 186A152 152 0 0 1 362 186" />
        </defs>

        <circle cx="210" cy="186" r="118" fill="url(#heat-area-fill)" />
        <circle cx="210" cy="222" r="62" fill="#ffffff" />

        <text className="fill-ink-400 text-[12.5px] font-medium tracking-wide">
          <textPath href="#heat-area-arc" startOffset="50%" textAnchor="middle">
            Эффективная площадь поверхности печи
          </textPath>
        </text>

        <text x="210" y="218" textAnchor="middle"
          className="fill-ink-600 text-[14px] font-semibold">
          Другой
        </text>
        <text x="210" y="236" textAnchor="middle"
          className="fill-ink-600 text-[14px] font-semibold">
          чан
        </text>
      </svg>

      <span className="pointer-events-none absolute top-[33%] left-1/2 -translate-x-1/2 text-white">
        <Logo crop="wordmark" title="" className="h-3.5 w-auto" />
      </span>
    </span>
  )
}

/**
 * The circulation, drawn over the render rather than baked into it.
 *
 * Vector keeps the arrows crisp at any size and in the brand's own colours,
 * and the wording stays editable. The coordinates are percentages of the
 * drawing, so the overlay follows it however the card is sized.
 */
function CirculationArrows({ height }: { height: number }) {
  const cold = 'var(--color-navy-700)'
  const hot = 'var(--color-brand-500)'

  return (
    <svg
      viewBox={`0 0 100 ${height}`}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full"
    >
      <defs>
        <marker id="circuit-cold" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4"
          markerHeight="4" markerUnits="userSpaceOnUse" orient="auto">
          <path d="M0 0.5 10 5 0 9.5z" fill={cold} />
        </marker>
        <marker id="circuit-hot" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4"
          markerHeight="4" markerUnits="userSpaceOnUse" orient="auto">
          <path d="M0 0.5 10 5 0 9.5z" fill={hot} />
        </marker>
      </defs>

      <g fill="none" strokeWidth="1.3" strokeLinecap="round">
        {/* Cold water falls along the walls into the jacket round the firebox. */}
        <path className="circuit-flow" d="M22 40C23 48 24 55 25 61" stroke={cold}
          markerEnd="url(#circuit-cold)" />
        <path className="circuit-flow" d="M78 40C77 48 76 55 75 61" stroke={cold}
          markerEnd="url(#circuit-cold)" />

        {/* Heated water rises back out of the jacket to the surface. */}
        <path className="circuit-flow" d="M41 72C40 62 39 52 38 43" stroke={hot}
          markerEnd="url(#circuit-hot)" style={{ animationDelay: '-0.9s' }} />
        <path className="circuit-flow" d="M59 72C60 62 61 52 62 43" stroke={hot}
          markerEnd="url(#circuit-hot)" style={{ animationDelay: '-0.9s' }} />
      </g>
    </svg>
  )
}
