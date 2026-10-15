import { photoUrl, videoUrl } from '../../lib/photos'
import { Reveal } from '../ui/Reveal'

/**
 * The shop on film: one wide walk through the works, and two upright clips
 * shot on a phone — welding and grinding, and the quick-release lining going
 * into a bowl. Files are fetched only when play is pressed.
 */
export function ProductionVideos() {
  return (
    <section className="pt-16 lg:pt-24">
      <div className="mx-auto max-w-(--container-content) px-4 sm:px-6">
        <Reveal>
          <figure>
            <video
              controls
              playsInline
              preload="none"
              poster={photoUrl('proizvodstvo-poster.webp')}
              aria-label="Видео о производстве: цех, где собираются банные чаны"
              className="aspect-video w-full rounded-panel bg-ink-900"
            >
              <source src={videoUrl('proizvodstvo.mp4')} type="video/mp4" />
            </video>
            <figcaption className="mt-4 text-sm text-ink-500">
              Наш цех: раскрой и гибка стали, сварка чаши, заготовка и шлифовка лиственницы,
              сборка.
            </figcaption>
          </figure>
        </Reveal>

        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          <Reveal>
            <figure className="mx-auto max-w-sm">
              <video
                controls
                playsInline
                preload="none"
                poster={photoUrl('tehprotsess-poster.webp')}
                aria-label="Технический процесс: сварка и зачистка нержавеющей стали"
                className="aspect-9/16 w-full rounded-panel bg-ink-900 object-cover"
              >
                <source src={videoUrl('tehprotsess.mp4')} type="video/mp4" />
              </video>
              <figcaption className="mt-4 text-sm text-ink-500">
                Технический процесс: сварка швов и зачистка нержавеющей стали.
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={80}>
            <figure className="mx-auto max-w-sm">
              <video
                controls
                playsInline
                preload="none"
                poster={photoUrl('bystrosemnaya-otdelka-poster.webp')}
                aria-label="Быстросъёмная отделка внутри чана"
                className="aspect-9/16 w-full rounded-panel bg-ink-900 object-cover"
              >
                <source src={videoUrl('bystrosemnaya-otdelka.mp4')} type="video/mp4" />
              </video>
              <figcaption className="mt-4 text-sm text-ink-500">
                Быстросъёмная отделка внутри чана: как она устанавливается в чашу.
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
