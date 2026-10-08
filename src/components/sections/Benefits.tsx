import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { PlaceholderImage } from '../ui/PlaceholderImage'
import { photoUrl } from '../../lib/photos'
import { useInView } from '../../lib/in-view'
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
                  {!benefit.textOnly && (
                    <div className="shrink-0 md:order-last md:w-1/2 lg:w-[55%]">
                      <BenefitDrawing benefit={benefit} />
                    </div>
                  )}

                  <div className="p-6 sm:p-8 lg:p-10">
                    <h3 className="text-xl leading-snug font-semibold text-navy-700 sm:text-2xl">
                      {benefit.title}
                    </h3>

                    {benefit.lead && (
                      <p className="mt-4 leading-relaxed text-ink-500">{benefit.lead}</p>
                    )}

                    {benefit.figures && (
                      <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4 border-y border-sand-200 py-5">
                        {benefit.figures.map((figure) => (
                          <div key={figure.caption}>
                            <dd>
                              <span className="font-display text-3xl text-navy-700">
                                {figure.value}
                              </span>
                              {figure.unit && (
                                <span className="ml-1 text-sm text-ink-400">{figure.unit}</span>
                              )}
                            </dd>
                            <dt className="mt-1 text-sm text-ink-400">{figure.caption}</dt>
                          </div>
                        ))}
                      </dl>
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
  const { ref, seen } = useInView<HTMLSpanElement>()

  // Silver until it is asked for: under the pointer on a desktop, and on a
  // touch screen once the card has been scrolled into view.
  // The render was made on its own near-white plate, a shade off the card's
  // white, so its rectangle showed as a crisp edge. Fading the outer few per
  // cent dissolves the join without touching the product, which sits well
  // inside the frame.
  const edges =
    '[mask-composite:intersect] [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent),linear-gradient(to_bottom,transparent,black_4%,black_96%,transparent)]'
  // The colour drains from the render, not from the overlay drawn on it: the
  // fire, the water and the circulation are the point of the picture and read
  // as accents against the silver, rather than going grey along with it.
  const skin = `${edges} relative block w-full`
  const render = `tint-on-view${seen ? ' tint-seen' : ''} absolute inset-0 size-full object-contain transition duration-500 motion-reduce:transition-none [@media(hover:hover)]:grayscale [@media(hover:hover)]:group-hover:grayscale-0`

  if (!image) {
    return <PlaceholderImage tone="studio" ratio="4/3" label={`Схема: ${wanted ?? ''}`} />
  }

  return (
    <span ref={ref} className={skin} style={{ aspectRatio: `${image.width} / ${image.height}` }}>
      <img src={photoUrl(image.color)} alt={title} loading="lazy" className={render} />
      {image.arrows === 'circuit' && (
        <CircuitOverlay height={(image.height / image.width) * 100} />
      )}
    </span>
  )
}

/**
 * What is moving in the tub, drawn over the render rather than baked into it.
 *
 * The render is a still, so the fire, the water and the smoke sit here as
 * shapes with their motion in the stylesheet. Vector keeps the arrows crisp at
 * any size and in the brand's own colours, and the wording stays editable.
 * Every coordinate is a percentage of the drawing, so the overlay follows it
 * however the card is sized — the positions were read off a percentage grid
 * laid over the render.
 */
function CircuitOverlay({ height }: { height: number }) {
  const cold = 'var(--color-navy-700)'
  const hot = 'var(--color-brand-500)'

  return (
    <svg
      viewBox={`0 0 100 ${height}`}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full"
    >
      <defs>
        <radialGradient id="circuit-smoke">
          <stop offset="0%" stopColor="#9aa3ad" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#9aa3ad" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#9aa3ad" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="circuit-ember">
          <stop offset="0%" stopColor="#ffb347" />
          <stop offset="55%" stopColor="#ff7a18" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ff7a18" stopOpacity="0" />
        </radialGradient>
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

      {/* The fire breathing in the firebox. */}
      <ellipse className="ember-breathe" cx="48.5" cy="71.5" rx="10" ry="7"
        fill="url(#circuit-ember)" />

      {/* Light travelling across the surface of the water. */}
      <g fill="#ffffff">
        <ellipse className="water-shimmer" cx="38" cy="35.5" rx="12" ry="1.1" />
        <ellipse className="water-shimmer" cx="62" cy="38.5" rx="9" ry="0.9"
          style={{ animationDelay: '-1.7s' }} />
        <ellipse className="water-shimmer" cx="48" cy="41.5" rx="14" ry="1" 
          style={{ animationDelay: '-3.2s' }} />
      </g>

      {/* Smoke off the cap. There is little sky above it in the frame, so the
          puffs drift sideways as they thin rather than climbing out of it, and
          they are soft-edged — a hard circle reads as a dot, not as smoke. */}
      <g fill="url(#circuit-smoke)">
        <circle className="smoke-drift" cx="56.3" cy="4.2" r="2.2" />
        <circle className="smoke-drift" cx="55.9" cy="3.6" r="1.7"
          style={{ animationDelay: '-1.5s' }} />
        <circle className="smoke-drift" cx="56.8" cy="3.9" r="2"
          style={{ animationDelay: '-3s' }} />
      </g>
    </svg>
  )
}
