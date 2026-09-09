import { Link } from 'react-router-dom'
import { Slider } from '../ui/Slider'
import { SectionHeading } from '../ui/SectionHeading'
import { PlaceholderImage } from '../ui/PlaceholderImage'
import { capacityLabel, models, type Model } from '../../data/models'

/**
 * Lifestyle banners, one per model: the tub in a real setting with the name set
 * large over the shot. Complements the catalogue, which carries the specs.
 */
export function ModelShowcase() {
  return (
    <section className="overflow-hidden py-20 lg:py-28">
      <div className="mx-auto max-w-(--container-content) px-4 sm:px-6">
        <SectionHeading
          eyebrow="Модельный ряд"
          title="Современные банные чаны"
          subtitle="Каждая модель — своя печь, своя форма чаши и своё время нагрева. Посмотрите, как они выглядят на участке."
        />
      </div>

      <Slider label="Модели в интерьере" className="mt-12">
        {models.map((model, index) => (
          <Banner key={model.slug} model={model} withCopy={index === 0} />
        ))}
      </Slider>
    </section>
  )
}

function Banner({ model, withCopy }: { model: Model; withCopy: boolean }) {
  return (
    <article
      className="relative isolate w-[85vw] shrink-0 snap-start overflow-hidden rounded-panel first:ml-4 last:mr-4 sm:w-[70vw] lg:w-[58rem] sm:first:ml-6 sm:last:mr-6"
      style={{ aspectRatio: '16/10' }}
    >
      <PlaceholderImage
        tone={model.theme}
        ratio="auto"
        silhouette={false}
        className="absolute inset-0 -z-10 size-full"
        label={`${model.name} на участке`}
      />

      <div className="flex h-full flex-col justify-between p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <h3 className="font-display text-4xl text-white uppercase sm:text-5xl lg:text-6xl">
            {model.name}
          </h3>

          {withCopy && (
            <p className="max-w-xs text-sm leading-relaxed text-white/85 sm:text-base">
              {model.accent}. {model.description}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to={`/${model.slug}`}
            className="rounded-full bg-white px-6 py-3 text-sm font-medium text-ink-900 transition-colors hover:bg-sand-100"
          >
            Смотреть чан подробнее ↗
          </Link>
          <ul className="flex flex-wrap gap-2">
            {model.sizes.map((size) => (
              <li
                key={size}
                className="rounded-full bg-white/15 px-3 py-1.5 text-xs text-white backdrop-blur"
              >
                {capacityLabel(size)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  )
}
