import { useSeo } from '../lib/seo'
import type { RouteMeta } from '../lib/routes'

/**
 * Routing shell for a page whose content is not built yet. Every route resolves
 * to a real URL with its own title, description and canonical; the blocks get
 * filled in page by page.
 */
export function StaticPage({ route }: { route: RouteMeta }) {
  useSeo({ title: route.title, description: route.description, path: route.path })

  return (
    <div className="mx-auto max-w-(--container-content) px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{route.title}</h1>
      <p className="mt-4 max-w-2xl text-ink-500">{route.description}</p>
      <p className="mt-10 rounded-(--radius-card) bg-brand-50 p-5 text-sm text-brand-800">
        Раздел в разработке: маршрут, метаданные и навигация готовы, блоки контента добавляются.
      </p>
    </div>
  )
}
