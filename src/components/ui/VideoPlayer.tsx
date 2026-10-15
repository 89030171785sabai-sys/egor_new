import { useRef, useState } from 'react'
import { photoUrl, videoUrl } from '../../lib/photos'

/**
 * A site-hosted video with a play mark on its poster. The browser's own
 * controls are there once it plays, but on the poster they are a thin bar at
 * the bottom that is easy to miss, so a large button is laid over the picture
 * while the video is stopped. The file is fetched only when play is pressed.
 */
export function VideoPlayer({
  file,
  poster,
  label,
  className = '',
}: {
  /** File name in `public/video`. */
  file: string
  /** File name in `public/photos`. */
  poster: string
  label: string
  /** Sets the shape: `aspect-video`, `aspect-9/16`. */
  className?: string
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  return (
    <div className={`relative overflow-hidden rounded-panel bg-ink-900 ${className}`}>
      <video
        ref={ref}
        controls
        playsInline
        preload="none"
        poster={photoUrl(poster)}
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        className="size-full object-cover"
      >
        <source src={videoUrl(file)} type="video/mp4" />
      </video>

      {!playing && (
        // Stops short of the bottom so the browser's progress bar stays usable.
        <button
          type="button"
          onClick={() => void ref.current?.play()}
          aria-label={`Смотреть: ${label}`}
          className="group absolute inset-x-0 top-0 bottom-14 grid place-items-center focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
        >
          <span className="grid size-16 place-items-center rounded-full bg-white/90 text-ink-900 shadow-lg shadow-ink-900/30 transition-transform group-hover:scale-110 sm:size-20">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="ml-1 size-7 sm:size-8">
              <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.4-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" fill="currentColor" />
            </svg>
          </span>
        </button>
      )}
    </div>
  )
}
