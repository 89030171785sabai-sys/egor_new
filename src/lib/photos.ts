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
