import { PageFigures, PageHeader } from '../components/ui/PageHeader'
import { Configurator } from '../components/configurator/Configurator'
import { FinalCta } from '../components/sections/FinalCta'
import { useSeo } from '../lib/seo'
import { calculatorRoute } from '../lib/routes'
import { fastestHeating, models } from '../data/models'

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
        lead="Выберите модель, размер и комплектацию. Оставьте заявку, чтобы получить точный расчёт."
      >
        <PageFigures
          items={[
            { value: String(models.length), caption: 'моделей в линейке' },
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

      <FinalCta />
    </>
  )
}
