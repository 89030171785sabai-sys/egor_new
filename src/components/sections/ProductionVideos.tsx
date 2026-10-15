import { VideoPlayer } from '../ui/VideoPlayer'
import { Reveal } from '../ui/Reveal'

/**
 * The shop on film: one wide walk through the works. The two upright clips
 * live in `ProductionClips`, waiting to be placed on the home page. Files are
 * fetched only when play is pressed.
 */
export function ProductionVideos() {
  return (
    <section className="pt-8 lg:pt-12">
      <div className="mx-auto max-w-(--container-content) px-4 sm:px-6">
        <Reveal>
          <figure>
            <VideoPlayer
              file="proizvodstvo.mp4"
              poster="proizvodstvo-poster.webp"
              label="Видео о производстве: цех, где собираются банные чаны"
              className="aspect-video"
            />
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
