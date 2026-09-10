/**
 * Customer reviews. Deliberately empty: real reviews come from the client,
 * and inventing them would put words in customers' mouths. Fill this in and
 * the section appears on the page by itself.
 */
export interface Review {
  author: string
  /** Where the review was left, e.g. a maps listing or a messenger. */
  source?: string
  city?: string
  /** Model the review is about, matched to a slug where it is known. */
  modelSlug?: string
  text: string
  date?: string
}

export const reviews: Review[] = []
