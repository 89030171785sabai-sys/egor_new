import { models } from '../data/models'

/**
 * Route map. Every page owns a real URL; navigation, page metadata, canonicals
 * and the generated sitemap all derive from this list.
 */
export interface RouteMeta {
  path: string
  label: string
  title: string
  description: string
  /** Excluded from the generated sitemap and marked noindex. */
  noindex?: boolean
}

export const homeRoute: RouteMeta = {
  path: '/',
  label: 'Главная',
  title: 'Банный чан под ключ от 180 000 ₽',
  description:
    'Собственный цех полного цикла: изготовим и доставим банный чан под ключ за 8 дней. Предоплата 10%, работа по договору, гарантия 13 лет.',
}

export const modelRoutes: RouteMeta[] = models.map((model) => ({
  path: `/${model.slug}`,
  label: model.name,
  title: model.seoTitle,
  description: model.seoDescription,
}))

export const legalRoutes: RouteMeta[] = [
  {
    path: '/privacy',
    label: 'Политика конфиденциальности',
    title: 'Политика конфиденциальности',
    description: 'Как мы обрабатываем и храним персональные данные посетителей сайта.',
  },
  {
    path: '/personal-data',
    label: 'Согласие на обработку данных',
    title: 'Согласие на обработку персональных данных',
    description: 'Условия согласия на обработку персональных данных, которые вы оставляете в формах.',
  },
]

export const routes: RouteMeta[] = [homeRoute, ...modelRoutes, ...legalRoutes]

/**
 * Sections of the home page that the navigation scrolls to. Anchors, not
 * routes — the home page is a single long document.
 */
export const homeSections = [
  { id: 'catalog', label: 'Каталог', primary: true },
  { id: 'calculator', label: 'Расчёт', primary: true },
  { id: 'production', label: 'Производство', primary: false },
  { id: 'delivery', label: 'Доставка', primary: true },
  { id: 'guarantees', label: 'Гарантии', primary: false },
  { id: 'faq', label: 'Вопросы', primary: false },
  { id: 'contacts', label: 'Контакты', primary: true },
] as const

export const routeByPath = (path: string) => routes.find((route) => route.path === path)
