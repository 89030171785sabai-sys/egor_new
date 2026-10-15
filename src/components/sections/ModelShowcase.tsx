import { Link } from 'react-router-dom'
import { Slider } from '../ui/Slider'
import { SectionHeading } from '../ui/SectionHeading'
import { PlaceholderImage } from '../ui/PlaceholderImage'
import { photoUrl } from '../../lib/photos'
import { models, modelSizes, sizeTier, type Model } from '../../data/models'

/**
 * Lifestyle banners, one per model: the tub in a real setting with the name set
 * large over the shot. Complements the catalogue, which carries the specs.
 */
export function ModelShowcase() {
  return (
    <section className="overflow-hidden py-10 lg:py-14">
      <div className="mx-auto max-w-(--container-content) px-4 sm:px-6">
        <SectionHeading
          eyebrow="Модельный ряд"
          title="Современные банные чаны"
          subtitle="Каждая модель — своя печь, своя форма чаши и своё время нагрева. Посмотрите, как они выглядят на участке."
        />
      </div>

      <Slider label="Модели в интерьере" className="mt-12">
        {models.map((model) => (
          <Banner key={model.slug} model={model} />
        ))}
      </Slider>
    </section>
  )
}

function Banner({ model }: { model: Model }) {
  return (
    <article
      className="relative isolate w-[78vw] shrink-0 snap-start overflow-hidden rounded-panel first:ml-4 last:mr-4 sm:w-[22rem] lg:w-[26rem] sm:first:ml-6 sm:last:mr-6"
      style={{ aspectRatio: '4/5' }}
    >
      {model.photos?.banner ? (
        <>
          <img
            src={photoUrl(model.photos.banner)}
            alt={`${model.name} на участке`}
            loading="lazy"
            className="absolute inset-0 -z-10 size-full object-cover"
          />
          {/* Небо сверху и плитка снизу светлее белого шрифта — подложка держит текст. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-900/55 via-transparent via-40% to-ink-900/60"
          />
        </>
      ) : (
        <PlaceholderImage
          tone={model.theme}
          ratio="auto"
          silhouette={false}
          className="absolute inset-0 -z-10 size-full"
          label={`${model.name} на участке`}
        />
      )}

      <div className="flex h-full flex-col justify-between p-6 sm:p-8">
        <h3 className="font-display text-[2.5rem] text-white sm:text-[2.75rem] lg:text-[3rem]">
          {model.name}
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to={`/${model.slug}`}
            className="rounded-full bg-white px-6 py-3 text-sm font-medium text-ink-900 transition-colors hover:bg-sand-100"
          >
            Смотреть чан подробнее ↗
          </Link>
          <ul className="flex flex-wrap gap-2">
            {modelSizes(model).map((size) => (
              <li
                key={size}
                className="rounded-full bg-white/15 px-3 py-1.5 text-xs text-white backdrop-blur"
              >
                {size} см · до {sizeTier(size)?.people}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  )
}
