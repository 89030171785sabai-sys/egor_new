import { ButtonLink } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { Slider } from '../ui/Slider'
import { VideoPlayer } from '../ui/VideoPlayer'
import { contacts } from '../../data/contacts'

interface Clip {
  file: string
  poster: string
  title: string
  /** Shape of the footage; upright clips are shown in a tall card. */
  shape: 'upright' | 'wide'
}

/**
 * Clips shown in the row, in order. Adding one is a line here plus the files in
 * `public/video` and `public/photos`.
 */
const clips: Clip[] = [
  { file: 'otzyv-pokupatelya.mp4', poster: 'otzyv-pokupatelya-poster.webp', title: 'Отзыв покупателя', shape: 'upright' },
  { file: 'otzyv-klienta.mp4', poster: 'otzyv-klienta-poster.webp', title: 'Отзыв клиента', shape: 'upright' },
  { file: 'videootzyv-zima.mp4', poster: 'videootzyv-zima-poster.webp', title: 'Видеоотзыв клиента: чан зимой', shape: 'upright' },
  { file: 'chan-posle-3-let.mp4', poster: 'chan-posle-3-let-poster.webp', title: 'Банный чан после трёх лет эксплуатации', shape: 'upright' },
  { file: 'krasota-zimoy-noch.mp4', poster: 'krasota-zimoy-noch-poster.webp', title: 'Красота, когда есть собственный банный чан HOTTUB', shape: 'upright' },
  { file: 'obzor-topki.mp4', poster: 'obzor-topki-poster.webp', title: 'Обзор топки чана с боковой приварной печью', shape: 'upright' },
  { file: 'tehprotsess.mp4', poster: 'tehprotsess-poster.webp', title: 'Технический процесс: сварка швов и зачистка нержавеющей стали', shape: 'upright' },
  { file: 'bystrosemnaya-otdelka.mp4', poster: 'bystrosemnaya-otdelka-poster.webp', title: 'Быстросъёмная отделка внутри чана', shape: 'upright' },
]

const rutube = contacts.social.find((item) => item.id === 'rutube')

/** Reviews, production and installation on film, with a way out to the channel. */
export function Videos() {
  return (
    <section id="videos" className="scroll-mt-28 overflow-hidden py-10 lg:py-14">
      <div className="mx-auto max-w-(--container-content) px-4 sm:px-6">
        <h2 className="font-display mx-auto max-w-4xl text-center text-[2rem] text-balance sm:text-[2.75rem] lg:text-[3.25rem]">
          <span className="text-ink-900">Отзывы наших покупателей, </span>
          <span className="text-navy-700">процесс производства и монтаж</span>
        </h2>
      </div>

      <Slider label="Видео" className="mt-12" hint="Листайте видео">
        {clips.map((clip, index) => (
          <Reveal
            key={clip.file}
            delay={Math.min(index, 4) * 60}
            className={`shrink-0 snap-start first:ml-4 last:mr-4 sm:first:ml-6 sm:last:mr-6 ${
              clip.shape === 'upright' ? 'w-60 sm:w-64' : 'w-[85vw] sm:w-[30rem]'
            }`}
          >
            <figure>
              <VideoPlayer
                file={clip.file}
                poster={clip.poster}
                label={clip.title}
                className={clip.shape === 'upright' ? 'aspect-9/16' : 'aspect-video'}
              />
              <figcaption className="mt-3 text-sm leading-snug text-ink-500">{clip.title}</figcaption>
            </figure>
          </Reveal>
        ))}
      </Slider>

      {rutube && (
        <div className="mt-10 flex justify-center px-4">
          <ButtonLink
            to={rutube.href}
            target="_blank"
            rel="noopener noreferrer"
            variant="dark"
            size="lg"
            arrow
          >
            Смотреть все видео на RuTube
          </ButtonLink>
        </div>
      )}
    </section>
  )
}
