import { useState } from 'react'
import { SectionHeading } from '../ui/SectionHeading'
import { faq } from '../../data/faq'

export function Faq() {
  // One open row at a time, the way the reference accordion behaves.
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="scroll-mt-28 py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeading align="center" eyebrow="Вопросы и ответы" title="Отвечаем на вопросы" />

        <dl className="mt-12">
          {faq.map((item, index) => {
            const open = openIndex === index

            return (
              <div key={item.question} className="border-b border-sand-300">
                <dt>
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenIndex(open ? null : index)}
                    className="flex w-full items-start justify-between gap-6 py-5 text-left transition-colors hover:text-brand-700"
                  >
                    <span className="text-base text-navy-700 sm:text-lg">{item.question}</span>
                    <span
                      aria-hidden="true"
                      className="relative mt-2 size-4 shrink-0 text-brand-500"
                    >
                      <span className="absolute top-1/2 left-0 h-[1.5px] w-4 -translate-y-1/2 bg-current" />
                      <span
                        className={`absolute top-0 left-1/2 h-4 w-[1.5px] -translate-x-1/2 bg-current transition-transform duration-300 ${
                          open ? 'scale-y-0' : 'scale-y-100'
                        }`}
                      />
                    </span>
                  </button>
                </dt>
                <dd
                  className="grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
                >
                  <p className="min-h-0 overflow-hidden pr-10 text-sm leading-relaxed text-ink-500">
                    <span className="block pb-5">{item.answer}</span>
                  </p>
                </dd>
              </div>
            )
          })}
        </dl>
      </div>
    </section>
  )
}
