import { useEffect } from 'react'

const SITE_NAME = 'Жар-Дым'
const ORIGIN = 'https://xn----7sbnf7av3f.xn--p1ai'

function upsertMeta(selector: string, create: () => HTMLElement, value: string) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = create()
    document.head.append(el)
  }
  if (el instanceof HTMLMetaElement) el.content = value
  if (el instanceof HTMLLinkElement) el.href = value
}

/** Sets a unique title, description and canonical for the current page. */
export function useSeo({
  title,
  description,
  path,
  robots = 'index, follow',
}: {
  title: string
  description: string
  path: string
  robots?: string
}) {
  useEffect(() => {
    document.title = `${title} — ${SITE_NAME}`
    upsertMeta('meta[name="description"]', () => {
      const meta = document.createElement('meta')
      meta.name = 'description'
      return meta
    }, description)
    upsertMeta('meta[name="robots"]', () => {
      const meta = document.createElement('meta')
      meta.name = 'robots'
      return meta
    }, robots)
    upsertMeta('link[rel="canonical"]', () => {
      const link = document.createElement('link')
      link.rel = 'canonical'
      return link
    }, `${ORIGIN}${path}`)
  }, [title, description, path, robots])
}
