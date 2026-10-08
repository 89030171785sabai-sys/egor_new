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
  title: 'Банный чан под ключ от 99 000 ₽',
  description:
    'Собственный цех полного цикла: изготовим и доставим банный чан под ключ за 8 дней. Предоплата 10%, работа по договору, гарантия 13 лет.',
}

export const calculatorRoute: RouteMeta = {
  path: '/calculator',
  label: 'Калькулятор',
  title: '3D-калькулятор банного чана',
  description:
    'Соберите банный чан онлайн: модель, размер, отделка, дымоход и опции — 3D-модель перестраивается на каждом шаге, цена считается сразу.',
}

export const modelRoutes: RouteMeta[] = models.map((model) => ({
  path: `/${model.slug}`,
  label: model.name,
  title: model.seoTitle,
  description: model.seoDescription,
}))

/**
 * Sections of the site that own a page of their own. The home page keeps a
 * short version of each and links here for the full one.
 */
export const contentRoutes: RouteMeta[] = [
  {
    path: '/catalog',
    label: 'Каталог',
    title: 'Каталог банных чанов',
    description:
      'Семь моделей банных чанов: тип печи, время нагрева, марка стали, комплектация и цены от 99 000 ₽.',
  },
  {
    path: '/production',
    label: 'Производство',
    title: 'Производство банных чанов',
    description:
      'Собственный цех полного цикла: отбор древесины, сушка, нержавеющая сталь AISI 304 и 430, современное оборудование.',
  },
  {
    path: '/delivery',
    label: 'Доставка и оплата',
    title: 'Доставка и оплата',
    description:
      'Доставка банных чанов по всей России со своих площадок, зоны и сроки, способы оплаты и предоплата 10%.',
  },
  {
    path: '/guarantees',
    label: 'Гарантии',
    title: 'Гарантии и документы',
    description:
      'Гарантия 13 лет на изделие, сертификат стали, паспорт изделия и работа по договору.',
  },
  {
    path: '/faq',
    label: 'Вопросы',
    title: 'Вопросы и ответы',
    description:
      'Ответы на частые вопросы о выборе, доставке, установке и уходе за банным чаном.',
  },
  {
    path: '/blog',
    label: 'Блог',
    title: 'Блог о банных чанах',
    description:
      'Как выбрать размер чана, сколько нужно дров, как ухаживать за нержавейкой и готовить площадку под установку.',
  },
  {
    path: '/contacts',
    label: 'Контакты',
    title: 'Контакты',
    description: 'Телефон, мессенджеры и адреса производств HOTTUB.',
  },
]

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
  {
    path: '/cookies',
    label: 'Политика cookie',
    title: 'Политика в отношении файлов cookie',
    description: 'Какие файлы cookie использует сайт, когда они появляются и как ими управлять.',
  },
]

/**
 * Pages that open on a dark block — the ones the header may sit on without a
 * plate of its own.
 *
 * It is a list of what opens dark rather than of what opens light, so a page
 * added later gets the readable treatment by default instead of white type on
 * white. The legal pages, a blog post and the not-found page all open light.
 */
export const opensDark = (pathname: string) => {
  const dark = [homeRoute.path, calculatorRoute.path, ...contentRoutes.map((route) => route.path)]
  return dark.includes(pathname) || modelRoutes.some((route) => route.path === pathname)
}

export const routes: RouteMeta[] = [
  homeRoute,
  calculatorRoute,
  ...contentRoutes,
  ...modelRoutes,
  ...legalRoutes,
]

/**
 * Main navigation: the section pages, plus the configurator, which stays an
 * anchor because it lives on the home page.
 */
export const navItems = [
  { to: '/catalog', label: 'Каталог', primary: true },
  { to: '/calculator', label: 'Калькулятор', primary: true },
  { to: '/production', label: 'Производство', primary: false },
  { to: '/delivery', label: 'Доставка', primary: true },
  { to: '/guarantees', label: 'Гарантии', primary: false },
  { to: '/faq', label: 'Вопросы', primary: false },
  { to: '/blog', label: 'Блог', primary: false },
  { to: '/contacts', label: 'Контакты', primary: true },
] as const

export const routeByPath = (path: string) => routes.find((route) => route.path === path)
