import { photoUrl, videoUrl } from '../../lib/photos'
import { Reveal } from '../ui/Reveal'

/**
 * Two upright clips shot on a phone: welding and grinding, and the
 * quick-release lining going into a bowl. Not placed on a page yet — the files
 * (`tehprotsess.mp4`, `bystrosemnaya-otdelka.mp4`) and their posters are in
 * `public`, ready for the home page.
 */
export function ProductionClips() {
  return (
    <section className="pt-16 lg:pt-24">
      <div className="mx-auto max-w-(--container-content) px-4 sm:px-6">
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
