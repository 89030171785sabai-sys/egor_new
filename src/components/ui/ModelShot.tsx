import { PlaceholderImage } from './PlaceholderImage'
import { photoUrl } from '../../lib/photos'
import type { Model } from '../../data/models'

type Slot = 'hero' | 'card'

const ratios: Record<string, string> = {
  '4/3': 'aspect-4/3',
  '16/10': 'aspect-16/10',
}

/**
 * A model's photograph where one exists, and the procedural stand-in where it
 * does not. Keeping the choice here means the line can be shot one model at a
 * time without any page learning about it.
 */
export function ModelShot({
  model,
  slot,
  ratio,
  className = '',
  fill = false,
  label,
}: {
  model: Model
  slot: Slot
  /** Ignored when `fill` is set — the shot then takes the parent's box. */
  ratio?: '4/3' | '16/10'
  className?: string
  /** Lays the shot over the whole parent, for full-bleed hero backdrops. */
  fill?: boolean
  /** Overrides the description of the shot the slot is waiting for. */
  label?: string
}) {
  const name = model.photos?.[slot] ?? (slot === 'card' ? model.photos?.hero : undefined)
  const described = label ?? `${model.name} — ${slot === 'hero' ? 'крупный кадр изделия' : 'товарное фото'}`

  if (!name) {
    return (
      <PlaceholderImage
        tone={slot === 'card' ? 'studio' : model.theme}
        ratio={fill ? 'auto' : (ratio ?? '4/3')}
        silhouette={!fill}
        className={fill ? `absolute inset-0 size-full ${className}` : className}
        label={described}
        showLabel={!fill}
      />
    )
  }

  const alt = `Банный чан «${model.name}»`

  if (fill) {
    return (
      <img
        src={photoUrl(name)}
        alt={alt}
        loading="eager"
        className={`absolute inset-0 size-full object-cover ${className}`}
      />
    )
  }

  return (
    <img
      src={photoUrl(name)}
      alt={alt}
      loading="lazy"
      className={`w-full object-cover ${ratios[ratio ?? '4/3']} ${className}`}
    />
  )
}
