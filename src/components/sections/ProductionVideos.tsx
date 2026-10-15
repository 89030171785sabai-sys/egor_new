import { photoUrl, videoUrl } from '../../lib/photos'
import { Reveal } from '../ui/Reveal'

/**
 * The shop on film: one wide walk through the works. The two upright clips
 * live in `ProductionClips`, waiting to be placed on the home page. Files are
 * fetched only when play is pressed.
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
      </div>
    </section>
  )
}
