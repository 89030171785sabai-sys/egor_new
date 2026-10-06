import { useMemo, useState } from 'react'
import { Button } from '../ui/Button'
import { PlaceholderImage } from '../ui/PlaceholderImage'
import { LeadForm } from '../forms/LeadForm'
import { quizSteps, summariseAnswers, type QuizOption, type QuizStep } from '../../data/quiz'

type Answers = Record<string, string[]>

/**
 * The configurator. A single-choice step advances as soon as an option is
 * picked; a multiple-choice step waits for the explicit next button, and the
 * gift step will not let go until exactly the required number is chosen.
 * The final screen collects the contact and sends the configuration with it.
 */
export function Quiz() {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [finished, setFinished] = useState(false)

  const step = quizSteps[index]
  const picked = answers[step.id] ?? []
  const isLast = index === quizSteps.length - 1

  const summary = useMemo(() => summariseAnswers(answers), [answers])

  function choose(option: QuizOption) {
    if (step.mode === 'single') {
      setAnswers((current) => ({ ...current, [step.id]: [option.id] }))
      goForward()
      return
    }

    setAnswers((current) => {
      const existing = current[step.id] ?? []
      const isOn = existing.includes(option.id)

      // A capped step drops the earliest pick instead of blocking the click.
      if (!isOn && step.pick && existing.length >= step.pick) {
        return { ...current, [step.id]: [...existing.slice(1), option.id] }
      }

      return {
        ...current,
        [step.id]: isOn ? existing.filter((id) => id !== option.id) : [...existing, option.id],
      }
    })
  }

  function goForward() {
    if (isLast) {
      setFinished(true)
      return
    }
    setIndex((current) => Math.min(current + 1, quizSteps.length - 1))
  }

  const canProceed = step.pick ? picked.length === step.pick : true

  if (finished) {
    return (
      <div className="rounded-panel bg-white p-6 sm:p-8">
        <p className="text-xs font-semibold tracking-[0.18em] text-brand-500 uppercase">
          Последний шаг
        </p>
        <h3 className="mt-3 text-2xl font-bold text-navy-700">Куда прислать расчёт?</h3>
        <p className="mt-2 text-sm text-ink-500">
          Менеджер посчитает стоимость по вашей комплектации и пришлёт в удобный канал.
        </p>

        {Object.keys(summary).length > 0 && (
          <dl className="mt-6 space-y-2 rounded-card bg-sand-100 p-4 text-sm">
            {Object.entries(summary).map(([question, answer]) => (
              <div key={question} className="flex flex-wrap gap-x-2">
                <dt className="text-ink-400">{question}</dt>
                <dd className="font-medium">{answer}</dd>
              </div>
            ))}
          </dl>
        )}

        <LeadForm
          source="quiz"
          fields={['name', 'channel']}
          submitLabel="Получить расчёт"
          payload={summary}
          successNote="Расчёт по вашей комплектации пришлём в течение рабочего дня."
          className="mt-6"
        />

        <button
          type="button"
          onClick={() => setFinished(false)}
          className="mt-4 text-sm text-ink-500 transition-colors hover:text-ink-800"
        >
          ← Вернуться к комплектации
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-panel bg-white p-5 sm:p-8">
      <Progress index={index} total={quizSteps.length} />

      <h3 className="mt-7 text-center text-xl font-bold text-navy-700 sm:text-2xl">{step.title}</h3>
      {step.hint && (
        <p className="mx-auto mt-3 max-w-lg text-center text-sm text-brand-600">{step.hint}</p>
      )}
      {step.pick && (
        <p className="mt-3 text-center text-sm text-ink-400">
          Выберите {step.pick} бонуса · выбрано {picked.length} из {step.pick}
        </p>
      )}

      <div className={`mt-7 grid gap-4 ${step.withImages ? 'sm:grid-cols-2' : 'sm:grid-cols-2'}`}>
        {step.options.map((option) => (
          <Option
            key={option.id}
            option={option}
            step={step}
            selected={picked.includes(option.id)}
            onSelect={() => choose(option)}
          />
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setIndex((current) => Math.max(current - 1, 0))}
          disabled={index === 0}
          className="text-sm text-ink-500 transition-colors hover:text-ink-800 disabled:invisible"
        >
          ← Назад
        </button>

        {step.mode === 'multi' && (
          <Button size="lg" onClick={goForward} disabled={!canProceed}>
            {isLast ? 'Готово →' : 'Далее →'}
          </Button>
        )}
      </div>
    </div>
  )
}

function Progress({ index, total }: { index: number; total: number }) {
  const percent = Math.round(((index + 1) / total) * 100)

  return (
    <div className="flex items-center gap-4">
      <div
        className="h-2 flex-1 overflow-hidden rounded-full bg-brand-100"
        role="progressbar"
        aria-valuenow={index + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label="Прогресс подбора"
      >
        <div
          className="h-full rounded-full bg-brand-500 transition-[width] duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="shrink-0 text-sm text-ink-400">
        Шаг {index + 1} из {total}
      </span>
    </div>
  )
}

function Option({
  option,
  step,
  selected,
  onSelect,
}: {
  option: QuizOption
  step: QuizStep
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      role={step.mode === 'single' ? 'radio' : 'checkbox'}
      aria-checked={selected}
      onClick={onSelect}
      className={`rounded-card p-4 text-left transition-all ${
        selected
          ? 'bg-brand-50 ring-2 ring-brand-500'
          : 'ring-1 ring-sand-200 hover:bg-sand-50 hover:ring-sand-300'
      }`}
    >
      {step.withImages && (
        <PlaceholderImage
          tone={option.tone ?? 'studio'}
          ratio="4/3"
          className="mb-4 rounded-card"
          label={option.title}
        />
      )}

      <span className="flex items-start justify-between gap-3">
        <span className="font-semibold">{option.title}</span>
        {step.mode === 'multi' && (
          <span
            aria-hidden="true"
            className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border transition-colors ${
              selected ? 'border-brand-500 bg-brand-500 text-white' : 'border-sand-300'
            }`}
          >
            {selected && (
              <svg viewBox="0 0 12 12" className="size-3">
                <path
                  d="m2 6.4 2.6 2.6L10 3.4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
        )}
      </span>

      {option.note && <span className="mt-1.5 block text-sm text-ink-500">{option.note}</span>}
    </button>
  )
}
