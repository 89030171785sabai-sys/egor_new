import { Link } from 'react-router-dom'
import { useSeo } from '../lib/seo'

export function NotFoundPage() {
  useSeo({
    title: 'Страница не найдена',
    description: 'Запрошенная страница не найдена.',
    path: '/404',
    robots: 'noindex, follow',
  })

  return (
    <div className="mx-auto max-w-(--container-content) px-4 py-24 text-center">
      <p className="text-6xl font-semibold text-brand-500">404</p>
      <h1 className="mt-4 text-2xl font-semibold">Страница не найдена</h1>
      <Link
        to="/"
        className="mt-8 inline-block rounded-(--radius-btn) bg-brand-500 px-6 py-3 text-white transition-colors hover:bg-brand-600"
      >
        На главную
      </Link>
    </div>
  )
}
