import type { Model } from '../../data/models'
import { studioPhotoBlend } from '../../lib/photos'
import { ModelShot } from './ModelShot'

// Align the bases. Match bowl widths on frontal photos and overall heights on the side-stove photos.
const productFraming: Record<string, { width: string; left: string; bottom: string }> = {
  'cherny-brilliant-front.jpg': { width: '94.3%', left: '4.8%', bottom: '1.5%' },
  'grafit-front-chimney.webp': { width: '93%', left: '3.5%', bottom: '4%' },
  'grant-front.png': { width: '107.7%', left: '-3.6%', bottom: '-0.8%' },
  'nefrit-front.jpg': { width: '72.5%', left: '13.8%', bottom: '5.0%' },
  'oniks-front.png': { width: '93.0%', left: '5.0%', bottom: '6.3%' },
  'oniks-pro-front.png': { width: '97.0%', left: '4.8%', bottom: '3.6%' },
  'valtsovavich-catalog.jpg': { width: '75.7%', left: '12.3%', bottom: '0.1%' },
}

export function ProductCardPhoto({ model }: { model: Model }) {
  const photo = model.photos?.card ?? ''
  const framing = productFraming[photo]

  if (!framing) {
    return (
      <ModelShot
        model={model}
        slot="card"
        ratio="10/9"
        contain={model.photos?.cardContain}
        className={model.photos?.cardContain ? 'aspect-10/9 w-full' : undefined}
      />
    )
  }

  return (
    <span className="relative block aspect-5/6">
      <ModelShot
        model={model}
        slot="card"
        contain
        className="absolute h-auto max-w-none"
        style={{ ...framing, ...studioPhotoBlend(photo) }}
      />
    </span>
  )
}
