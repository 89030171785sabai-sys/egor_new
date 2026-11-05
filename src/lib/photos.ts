import type { CSSProperties } from 'react'

/**
 * Real photography lives in `public/photos`. The site is served from a
 * sub-path on Pages, so a stored name is turned into a URL here rather than
 * hard-coded with a leading slash anywhere. The build stamps each file's
 * fingerprint onto its URL, so replacing a photo under the same name reaches
 * visitors whose browser still holds the previous one.
 */
export const photoUrl = (name: string) => {
  const fingerprint = __PHOTO_FINGERPRINTS__[name]
  const url = `${import.meta.env.BASE_URL}photos/${name}`

  return fingerprint ? `${url}?v=${fingerprint}` : url
}

/** Videos live in `public/video`; same rule as for photographs, no hard-coded leading slash. */
export const videoUrl = (name: string) => `${import.meta.env.BASE_URL}video/${name}`

// Start fading the floor reflection below the measured base of each tub.
const floorFadeStart: Record<string, string> = {
  "grafit-front.png": "90.8%",
  "cherny-brilliant-front.png": "92.8%",
  "valtsovavich-catalog.png": "91.6%",
  "nefrit-front.png": "97.2%",
  "oniks-front.png": "98.8%",
  "oniks-pro-front.png": "95.6%",
  "grant-front.png": "91.2%",
};

export const studioPhotoBlend = (name: string): CSSProperties => ({
  // Lift the nearly white background before blending away the outer edges.
  filter: 'brightness(1.04)',
  maskComposite: 'intersect',
  maskImage: `linear-gradient(to right, transparent, black 7%, black 93%, transparent), linear-gradient(to bottom, transparent, black 1.2%, black ${floorFadeStart[name] ?? '99%'}, transparent)`,
})
