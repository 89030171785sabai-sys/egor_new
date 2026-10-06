import type { CSSProperties } from 'react'
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
  style,
  fill = false,
  contain = false,
  label,
}: {
  model: Model
  slot: Slot
  /** Ignored when `fill` is set — the shot then takes the parent's box. */
  ratio?: '4/3' | '16/10'
  className?: string
  /** Lets a caller size the shot, as the hero does per model. */
  style?: CSSProperties
  /** Lays the shot over the whole parent, for full-bleed hero backdrops. */
  fill?: boolean
  /**
   * Shows the whole product rather than filling a box with it. A studio shot
   * of a tub gets its chimney and its base cropped off by `object-cover`, so
   * anywhere the product is the subject it is contained, not covered.
   */
  contain?: boolean
  /** Overrides the description of the shot the slot is waiting for. */
  label?: string
}) {
  const name = model.photos?.[slot]
  const described = label ?? `${model.name} — ${slot === 'hero' ? 'крупный кадр изделия' : 'товарное фото'}`
  const alt = `Банный чан «${model.name}»`

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

  if (contain) {
    return (
      <img
        src={photoUrl(name)}
        alt={alt}
        loading="eager"
        style={style}
        className={`object-contain ${className}`}
      />
    )
  }

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
