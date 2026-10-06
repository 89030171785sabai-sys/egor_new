/**
 * Real photography lives in `public/photos`. The site is served from a
 * sub-path on Pages, so a stored name is turned into a URL here rather than
 * hard-coded with a leading slash anywhere.
 */
export const photoUrl = (name: string) => `${import.meta.env.BASE_URL}photos/${name}`
