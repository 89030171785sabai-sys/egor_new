import { PageFigures, PageHeader } from '../components/ui/PageHeader'
import { Catalog } from '../components/sections/Catalog'
import { ModelShowcase } from '../components/sections/ModelShowcase'
import { Production } from '../components/sections/Production'
import { Process } from '../components/sections/Process'
import { Customization } from '../components/sections/Customization'
import { Delivery } from '../components/sections/Delivery'
import { Guarantees } from '../components/sections/Guarantees'
import { Faq } from '../components/sections/Faq'
import { Contacts } from '../components/sections/Contacts'
import { FinalCta } from '../components/sections/FinalCta'
import { useSeo } from '../lib/seo'
import { contentRoutes } from '../lib/routes'
import { formatPrice, models, priceFrom } from '../data/models'

/** Metadata for a section page, looked up by its path. */
function useSectionSeo(path: string) {
  const route = contentRoutes.find((candidate) => candidate.path === path)
  useSeo({
    title: route?.title ?? '',
    description: route?.description ?? '',
    path,
  })
}

export function CatalogPage() {
  useSectionSeo('/catalog')

  return (
    <>
      <PageHeader
        title="Каталог банных чанов"
        lead="Шесть моделей: разная форма чаши, своя печь и своё время нагрева. Любую делаем под ваш размер и отделку."
      >
        <PageFigures
          items={[
            { value: String(models.length), caption: 'моделей в линейке' },
            { value: formatPrice(priceFrom), caption: 'за полный комплект' },
            { value: '1,5', unit: 'ч', caption: 'самый быстрый нагрев' },
            { value: '12', unit: 'чел.', caption: 'максимальная вместимость' },
          ]}
        />
      </PageHeader>

      <Catalog />
      <ModelShowcase />
      <FinalCta />
    </>
  )
}

export function ProductionPage() {
  useSectionSeo('/production')

  return (
    <>
      <PageHeader
        title="Собственный цех полного цикла"
        breadcrumb="Производство"
        lead="От отбора древесины до финальной сборки — всё на своём производстве. Поэтому держим срок в 8 дней и отвечаем за качество швов."
      >
        <PageFigures
          items={[
            { value: '8', unit: 'дней', caption: 'под ключ' },
            { value: '50', unit: 'лет', caption: 'срок службы изделия' },
            { value: '7–10', unit: 'дней', caption: 'сушка древесины' },
            { value: '15', unit: 'лет', caption: 'опыт мастеров цеха' },
          ]}
        />
      </PageHeader>

      <Production />
      <Customization />
      <Process />
      <FinalCta />
    </>
  )
}

export function DeliveryPage() {
  useSectionSeo('/delivery')

  return (
    <>
      <PageHeader
        title="Доставка и оплата"
        lead="Отгружаем со своих площадок в Москве и Коркино, везём по всей России. Работаем по договору, начинаем с предоплаты 10%."
      />
      <Delivery />
      <FinalCta />
    </>
  )
}

export function GuaranteesPage() {
  useSectionSeo('/guarantees')

  return (
    <>
      <PageHeader
        title="Гарантии и документы"
        lead="Отвечаем за герметичность швов и качество изделия 13 лет. К каждому чану — паспорт, инструкция и документы на сталь."
      />
      <Guarantees />
      <FinalCta />
    </>
  )
}

export function FaqPage() {
  useSectionSeo('/faq')

  return (
    <>
      <PageHeader
        title="Вопросы и ответы"
        breadcrumb="Вопросы"
        lead="Собрали то, о чём спрашивают чаще всего: от ухода за нержавейкой до подготовки площадки."
      />
      <Faq />
      <FinalCta />
    </>
  )
}

export function ContactsPage() {
  useSectionSeo('/contacts')

  return (
    <>
      <PageHeader
        title="Контакты"
        lead="Позвоните или напишите в мессенджер — ответим в рабочее время и посчитаем стоимость по вашей комплектации."
      />
      <Contacts />
    </>
  )
}
