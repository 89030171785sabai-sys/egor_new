import { PageFigures, PageHeader } from '../components/ui/PageHeader'
import { Configurator } from '../components/configurator/Configurator'
import { FinalCta } from '../components/sections/FinalCta'
import { useSeo } from '../lib/seo'
import { calculatorRoute } from '../lib/routes'
import { fastestHeating, formatPrice, models } from '../data/models'

const startingPrice = Math.min(...models.flatMap((model) => model.offers.map((offer) => offer.price)))

export function CalculatorPage() {
  useSeo({
    title: calculatorRoute.title,
    description: calculatorRoute.description,
    path: calculatorRoute.path,
  })

  return (
    <>
      <PageHeader
        title="Калькулятор банного чана"
        breadcrumb="Калькулятор"
        lead="Выберите модель и размер, чтобы увидеть цену чана. Стоимость дополнительных опций уточним по заявке."
      >
        <PageFigures
          items={[
            { value: String(models.length), caption: 'моделей в линейке' },
            { value: `от ${formatPrice(startingPrice)}`, caption: 'базовая цена чана' },
            {
              value: String(fastestHeating).replace('.', ','),
              unit: 'ч',
              caption: 'самый быстрый нагрев',
            },
            { value: '8', unit: 'дней', caption: 'под ключ — от заказа до участка' },
          ]}
        />
      </PageHeader>

      <section className="py-10 lg:py-14">
        <div className="mx-auto max-w-(--container-content) px-4 sm:px-6">
          <Configurator />
        </div>
      </section>

      <FinalCta catalogTo="#configurator-lead" />
    </>
  )
}
