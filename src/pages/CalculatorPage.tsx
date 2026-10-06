import { PageFigures, PageHeader } from '../components/ui/PageHeader'
import { Configurator } from '../components/configurator/Configurator'
import { FinalCta } from '../components/sections/FinalCta'
import { useSeo } from '../lib/seo'
import { calculatorRoute } from '../lib/routes'
import { fastestHeating, formatPrice, models, priceFrom } from '../data/models'

export function CalculatorPage() {
  useSeo({
    title: calculatorRoute.title,
    description: calculatorRoute.description,
    path: calculatorRoute.path,
  })

  return (
    <>
      <PageHeader
        title="3D-калькулятор банного чана"
        breadcrumb="Калькулятор"
        tone="ink"
        photo="готовый чан на участке — для фона шапки калькулятора"
        lead="Соберите чан под себя: модель, размер, отделка, дымоход и опции. Модель перестраивается на каждом шаге, а цена считается сразу."
      >
        <PageFigures
          items={[
            { value: String(models.length), caption: 'моделей в линейке' },
            { value: formatPrice(priceFrom), caption: 'стартовая цена' },
            {
              value: String(fastestHeating).replace('.', ','),
              unit: 'ч',
              caption: 'самый быстрый нагрев',
            },
            { value: '8', unit: 'дней', caption: 'под ключ — от заказа до участка' },
          ]}
        />
      </PageHeader>

      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-(--container-content) px-4 sm:px-6">
          <Configurator />
        </div>
      </section>

      <FinalCta />
    </>
  )
}
