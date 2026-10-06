import { Link } from 'react-router-dom'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { ModelShot } from '../ui/ModelShot'
import { heatingTypes } from '../../data/heating'
import { formatHours, modelBySlug } from '../../data/models'

/**
 * How the water gets hot — one card per stove layout in the line.
 *
 * The shots sit in greyscale and come to colour under the pointer, which lets
 * the row read as one set and still rewards a look at any single card. On a
 * touch screen there is no pointer to reward, so the colour is simply there.
 */
export function HeatingTypes() {
  return (
    <section id="heating" className="scroll-mt-28 bg-sand-100 py-20 lg:py-28">
      <div className="mx-auto max-w-(--container-content) px-4 sm:px-6">
        <SectionHeading
          eyebrow="Нагрев"
          title="Чем греется вода"
          subtitle="Модели отличаются печью — от открытого очага до водяного контура. От неё зависит время нагрева, расход дров и то, где чан можно поставить."
        />

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {heatingTypes.map((type, index) => {
            const model = modelBySlug(type.slug)
            if (!model) return null

            return (
              <li key={type.id} className="h-full">
                <Reveal delay={(index % 3) * 80} className="h-full">
                  <Link
                    to={`/${model.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-panel bg-white transition-shadow hover:shadow-xl hover:shadow-ink-900/10"
                  >
                    <div className="p-6 pb-5">
                      <h3 className="text-lg leading-snug font-semibold text-navy-700">
                        {type.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-ink-500">{type.text}</p>
                    </div>

                    <div className="mt-auto px-6 pb-5">
                      <p className="flex items-center gap-2 text-sm text-ink-400">
                        <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-500" />
                        {model.name} · нагрев {formatHours(model.heatingHours)}
                      </p>
                    </div>

                    <div className="overflow-hidden bg-sand-200">
                      <ModelShot
                        model={model}
                        slot="hero"
                        ratio="4/3"
                        className="object-bottom transition duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100 [@media(hover:hover)]:grayscale [@media(hover:hover)]:group-hover:grayscale-0"
                      />
                    </div>
                  </Link>
                </Reveal>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
