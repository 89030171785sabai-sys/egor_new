import { Configurator } from '../configurator/Configurator'
import { SectionHeading } from '../ui/SectionHeading'

/**
 * The home page carries the same calculator as the /calculator page — the 3D
 * configurator — so a visitor who builds a tub here sees exactly what the
 * dedicated page offers. The section keeps its `calculator` anchor for the
 * buttons that scroll to it.
 */
export function Calculator() {
  return (
    <section id="calculator" className="scroll-mt-28 py-20 lg:py-28">
      <div className="mx-auto max-w-(--container-content) px-4 sm:px-6">
        <SectionHeading
          align="center"
          title="Соберите чан под себя"
          subtitle="Модель, размер, отделка, дымоход и опции. Чан перестраивается на каждом шаге, а цена считается сразу. При заказе — 2 подарка."
        />

        <div className="mt-12">
          <Configurator />
        </div>
      </div>
    </section>
  )
}
