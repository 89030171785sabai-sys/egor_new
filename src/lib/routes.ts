/**
 * Route map. Each page owns a real URL, so navigation, canonicals and the
 * generated sitemap all derive from this single list.
 */
export interface RouteMeta {
  path: string
  label: string
  title: string
  description: string
  /** Shown in the main navigation menu. */
  inNav?: boolean
}

export const routes: RouteMeta[] = [
  {
    path: '/',
    label: 'Главная',
    title: 'Банные чаны от производителя',
    description: 'Изготовление банных чанов с подогревом на дровах, доставка и установка под ключ.',
    inNav: false,
  },
  {
    path: '/catalog',
    label: 'Каталог',
    title: 'Каталог банных чанов',
    description: 'Модели банных чанов и купелей: размеры, комплектации и цены от производителя.',
    inNav: true,
  },
  {
    path: '/production',
    label: 'Производство',
    title: 'Производство банных чанов',
    description: 'Как мы делаем банные чаны: материалы, сварка, обшивка и контроль качества.',
    inNav: true,
  },
  {
    path: '/delivery',
    label: 'Доставка',
    title: 'Доставка и установка',
    description: 'Условия доставки банных чанов по России, разгрузка и установка на площадке.',
    inNav: true,
  },
  {
    path: '/payment',
    label: 'Оплата',
    title: 'Оплата и рассрочка',
    description: 'Способы оплаты банного чана: наличные, перевод, рассрочка и работа по договору.',
    inNav: true,
  },
  {
    path: '/reviews',
    label: 'Отзывы',
    title: 'Отзывы покупателей',
    description: 'Отзывы владельцев банных чанов и фотографии установленных изделий.',
    inNav: true,
  },
  {
    path: '/about',
    label: 'О компании',
    title: 'О компании',
    description: 'Кто мы, сколько лет делаем банные чаны и почему нам доверяют.',
    inNav: true,
  },
  {
    path: '/faq',
    label: 'Вопросы и ответы',
    title: 'Вопросы и ответы',
    description: 'Ответы на частые вопросы о выборе, эксплуатации и уходе за банным чаном.',
    inNav: true,
  },
  {
    path: '/contacts',
    label: 'Контакты',
    title: 'Контакты',
    description: 'Телефон, мессенджеры и адрес производства банных чанов «Дым и Пар».',
    inNav: true,
  },
]

export const navRoutes = routes.filter((route) => route.inNav)

export const routeByPath = (path: string) => routes.find((route) => route.path === path)
