import type { StovePhoto } from '../../data/heating'
import { photoUrl } from '../../lib/photos'

/**
 * A stove close-up: silver at rest, colour under the pointer.
 *
 * The client supplies two renders per stove, and their silver is a deliberate
 * high-key treatment rather than a desaturation, so where both takes line up
 * this crossfades between the files. Where they do not — one stove has its
 * removed parts laid out on opposite sides in each take — only the colour one
 * is given, and the page desaturates it instead. Where there is no pointer to
 * reward, the colour take is simply shown.
 */
export function StoveShot({ photo, title }: { photo: StovePhoto; title: string }) {
  if (!photo.grey) {
    return (
      <img
        src={photoUrl(photo.color)}
        alt={title}
        loading="lazy"
        className="aspect-4/3 w-full rounded-panel bg-white object-contain transition duration-500 motion-reduce:transition-none [@media(hover:hover)]:grayscale [@media(hover:hover)]:group-hover:grayscale-0"
      />
    )
  }

  return (
    <span className="relative block aspect-4/3 w-full overflow-hidden rounded-panel bg-white">
      <img
        src={photoUrl(photo.grey)}
        alt=""
        loading="lazy"
        aria-hidden="true"
        className="absolute inset-0 size-full object-contain opacity-0 [@media(hover:hover)]:opacity-100"
      />
      <img
        src={photoUrl(photo.color)}
        alt={title}
        loading="lazy"
        className="absolute inset-0 size-full object-contain transition-opacity duration-500 motion-reduce:transition-none [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
      />
    </span>
  )
}
