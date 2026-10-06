import { useEffect, useMemo, useState } from 'react'
import { Logo } from '../ui/Logo'
import { LeadForm } from '../forms/LeadForm'
import { contacts } from '../../data/contacts'
import { quizSteps, summariseAnswers, type QuizOption } from '../../data/quiz'

type Answers = Record<string, string[]>

const DISMISSED_KEY = 'quiz-popup-dismissed'
const SHOW_AFTER = 700
/** Clear of the footer, so the card never lands on top of it. */
const FOOTER_GUARD = 420

/**
 * The floating quiz: a consultant card that opens by itself past the first
 * screen and walks through the configurator one question at a time. Closing it
 * collapses the card to a tab rather than throwing the answers away.
 */
export function QuizPopup() {
  const [visible, setVisible] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [dismissed, setDismissed] = useState(true)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [finished, setFinished] = useState(false)

  const step = quizSteps[index]!
  const picked = answers[step.id] ?? []
  const isLast = index === quizSteps.length - 1
  const progress = finished ? 95 : Math.round((index / quizSteps.length) * 100)

  const summary = useMemo(() => summariseAnswers(answers), [answers])

  useEffect(() => {
    try {
      setDismissed(sessionStorage.getItem(DISMISSED_KEY) === '1')
    } catch {
      setDismissed(false)
    }
  }, [])

  useEffect(() => {
    if (dismissed) return

    const onScroll = () => {
      const nearBottom =
        window.scrollY + window.innerHeight > document.documentElement.scrollHeight - FOOTER_GUARD
      setVisible(window.scrollY > SHOW_AFTER && !nearBottom)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [dismissed])

  function dismiss() {
    setDismissed(true)
    try {
      sessionStorage.setItem(DISMISSED_KEY, '1')
    } catch {
      // A blocked storage is no reason to keep the card on screen.
    }
  }

  function choose(option: QuizOption) {
    if (step.mode === 'single') {
      setAnswers((current) => ({ ...current, [step.id]: [option.id] }))
      // A single-choice step moves on by itself — one tap, one question.
      window.setTimeout(forward, 160)
      return
    }

    setAnswers((current) => {
      const existing = current[step.id] ?? []
      const isOn = existing.includes(option.id)
      // A capped step drops the earliest pick instead of blocking the tap.
      if (!isOn && step.pick && existing.length >= step.pick) {
        return { ...current, [step.id]: [...existing.slice(1), option.id] }
      }
      return {
        ...current,
        [step.id]: isOn ? existing.filter((id) => id !== option.id) : [...existing, option.id],
      }
    })
  }

  function forward() {
    setIndex((current) => {
      if (current >= quizSteps.length - 1) {
        setFinished(true)
        return current
      }
      return current + 1
    })
  }

  function back() {
    if (finished) {
      setFinished(false)
      return
    }
    setIndex((current) => Math.max(0, current - 1))
  }

  if (dismissed || !visible) return null

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        className="fixed bottom-4 left-4 z-40 hidden w-[13rem] overflow-hidden rounded-card bg-white text-left shadow-2xl shadow-ink-900/20 sm:block"
      >
        <span className="block px-4 pt-4 pb-3 text-sm font-semibold text-ink-900">
          {finished ? 'Осталось заполнить форму…' : 'Продолжить подбор чана'}
        </span>
        <span className="block h-1.5 bg-sand-200">
          <span
            className="block h-full bg-brand-500 transition-[width] duration-300"
            style={{ width: `${Math.max(progress, 6)}%` }}
          />
        </span>
      </button>
    )
  }

  const canAdvance = step.pick ? picked.length === step.pick : picked.length > 0

  return (
    <aside className="fixed bottom-4 left-4 z-40 hidden w-[21rem] rounded-panel bg-white shadow-2xl shadow-ink-900/25 sm:block">
      <div className="flex items-start gap-3 px-5 pt-5">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink-900 text-white">
          <Logo crop="emblem" className="h-4 w-auto" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold">{contacts.companyName}</p>
          <p className="text-xs text-ink-400">консультант</p>
        </div>
        <div className="ml-auto flex shrink-0 gap-1">
          <IconButton label="Свернуть подбор" onClick={() => setCollapsed(true)}>
            <path d="M2 6h8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </IconButton>
          <IconButton label="Закрыть подбор" onClick={dismiss}>
            <path
              d="m2 2 8 8M10 2l-8 8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </IconButton>
        </div>
      </div>

      {(finished || index > 0) && (
        <div className="mt-4 px-5">
          <div className="flex items-center justify-between text-xs text-ink-400">
            <span>
              {finished ? 'Отлично, последний шаг!' : `Шаг ${index + 1} из ${quizSteps.length}`}
            </span>
            <span className="font-medium text-brand-600">{progress}%</span>
          </div>
          <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-sand-200">
            <span
              className="block h-full rounded-full bg-brand-500 transition-[width] duration-300"
              style={{ width: `${Math.max(progress, 4)}%` }}
            />
          </span>
        </div>
      )}

      {finished ? (
        <div className="px-5 pt-4 pb-5">
          <p className="text-sm leading-relaxed font-semibold">
            Мы подобрали для вас чан. Куда прислать расчёт?
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-ink-400">
            Пришлём стоимость вашей комплектации и подборку готовых проектов.{' '}
            {contacts.companyName} не звонит без предупреждения — напишем в удобный канал.
          </p>
          <LeadForm
            source="quiz"
            fields={['phone']}
            submitLabel="Получить результаты"
            payload={summary}
            className="mt-4"
          />
        </div>
      ) : (
        <>
          <div className="px-5 pt-4">
            <p className="text-sm leading-snug font-semibold">{step.title}</p>
            {step.hint && <p className="mt-1.5 text-xs leading-relaxed text-ink-400">{step.hint}</p>}
            {step.mode === 'multi' && (
              <p className="mt-2 inline-block rounded-full bg-sand-100 px-2.5 py-1 text-[0.7rem] text-ink-500">
                {step.pick ? `выберите ${step.pick}` : 'можно выбрать несколько'}
              </p>
            )}
          </div>

          <ul className="mt-3 max-h-[38vh] space-y-2 overflow-y-auto px-5">
            {step.options.map((option) => {
              const active = picked.includes(option.id)
              return (
                <li key={option.id}>
                  <button
                    type="button"
                    onClick={() => choose(option)}
                    aria-pressed={active}
                    className={`flex w-full items-start gap-2.5 rounded-card border p-3 text-left transition-colors ${
                      active
                        ? 'border-brand-500 bg-brand-50'
                        : 'border-sand-200 hover:border-ink-300'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 grid size-4 shrink-0 place-items-center border ${
                        step.mode === 'multi' ? 'rounded-[0.3rem]' : 'rounded-full'
                      } ${active ? 'border-brand-500 bg-brand-500 text-white' : 'border-ink-300'}`}
                    >
                      {active && (
                        <svg viewBox="0 0 12 12" className="size-2">
                          <path
                            d="m2 6.4 2.6 2.6L10 3.4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">{option.title}</span>
                      {option.note && (
                        <span className="mt-0.5 block text-xs leading-relaxed text-ink-400">
                          {option.note}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-3 px-5 pt-4 pb-5">
            <button
              type="button"
              onClick={back}
              disabled={index === 0}
              aria-label="Назад"
              className="grid size-9 shrink-0 place-items-center rounded-full border border-sand-200 text-ink-500 transition-colors enabled:hover:border-ink-300 disabled:opacity-40"
            >
              <svg viewBox="0 0 12 12" aria-hidden="true" className="size-3">
                <path
                  d="M7.5 2 3.5 6l4 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={forward}
              disabled={!canAdvance}
              className="ml-auto rounded-full bg-brand-500 px-6 py-2.5 text-sm font-medium text-white transition-colors enabled:hover:bg-brand-600 disabled:opacity-40"
            >
              {isLast ? 'Готово' : 'Далее'}
            </button>
          </div>
        </>
      )}
    </aside>
  )
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-7 place-items-center rounded-full text-ink-400 transition-colors hover:bg-sand-200 hover:text-ink-700"
    >
      <svg viewBox="0 0 12 12" aria-hidden="true" className="size-3">
        {children}
      </svg>
    </button>
  )
}
