import { SectionHeading } from '../ui/SectionHeading'
import { ModelCard } from '../ui/ModelCard'
import { Reveal } from '../ui/Reveal'
import { models, formatPrice, priceFrom } from '../../data/models'

export function Catalog() {
  return (
    <section id="catalog" className="scroll-mt-28 py-20 lg:py-28">
      <div className="mx-auto max-w-(--container-content) px-4 sm:px-6">
        <SectionHeading
          eyebrow="Каталог"
          title="Выберите свой чан"
          subtitle={`Цены от ${formatPrice(priceFrom)} за полный комплект.`}
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {models.map((model, index) => (
            <Reveal key={model.slug} delay={(index % 2) * 90}>
              <ModelCard model={model} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
