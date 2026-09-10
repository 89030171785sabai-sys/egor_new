import { useEffect, useState } from 'react'
import { quizSteps } from '../../data/quiz'
import { contacts, hasContact } from '../../data/contacts'

/** Carries a first answer from the teaser into the configurator. */
export const QUIZ_PRESELECT_EVENT = 'quiz:preselect'

export interface QuizPreselect {
  stepId: string
  optionId: string
}

const DISMISSED_KEY = 'quiz-teaser-dismissed'

/**
 * The two floating elements the reference carries: a picker that opens by
 * itself once past the first screen on the left, and the messenger dock on the
 * right.
 */
export function FloatingWidgets() {
  return (
    <>
      <QuizTeaser />
      <MessengerDock />
    </>
  )
}

function QuizTeaser() {
  const [open, setOpen] = useState(false)
  const [dismissed, setDismissed] = useState(true)
  const step = quizSteps[0]

  useEffect(() => {
    // A visitor who closed it should not be nagged again this visit.
    try {
      setDismissed(sessionStorage.getItem(DISMISSED_KEY) === '1')
    } catch {
      setDismissed(false)
    }
  }, [])

  useEffect(() => {
    if (dismissed) return

    const onScroll = () => setOpen(window.scrollY > 700)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [dismissed])

  function close() {
    setOpen(false)
    setDismissed(true)
    try {
      sessionStorage.setItem(DISMISSED_KEY, '1')
    } catch {
      // A blocked storage is no reason to keep the card on screen.
    }
  }

  function choose(optionId: string) {
    window.dispatchEvent(
      new CustomEvent<QuizPreselect>(QUIZ_PRESELECT_EVENT, {
        detail: { stepId: step.id, optionId },
      }),
    )
    document.querySelector('#calculator')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    close()
  }

  if (dismissed || !open) return null

  return (
    <aside className="fixed bottom-4 left-4 z-40 hidden w-[19rem] rounded-panel bg-white p-4 shadow-2xl shadow-ink-900/20 sm:block">
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-500 text-xs font-semibold text-white">
          ДП
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold">{contacts.companyName}</p>
          <p className="text-xs text-ink-400">консультант</p>
        </div>
        <button
          type="button"
          onClick={close}
          aria-label="Закрыть подбор"
          className="ml-auto grid size-7 shrink-0 place-items-center rounded-full text-ink-400 transition-colors hover:bg-sand-200 hover:text-ink-700"
        >
          <svg viewBox="0 0 12 12" aria-hidden="true" className="size-3">
            <path
              d="m2 2 8 8M10 2l-8 8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <p className="mt-4 text-sm font-semibold">{step.title}</p>
      <p className="mt-1 text-xs leading-relaxed text-ink-400">
        От количества человек зависит размер чана.
      </p>

      <div className="mt-3 space-y-1.5">
        {step.options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => choose(option.id)}
            className="flex w-full items-center gap-2.5 rounded-card px-3 py-2.5 text-left text-sm ring-1 ring-sand-200 transition-colors hover:bg-brand-50 hover:ring-brand-300"
          >
            <span aria-hidden="true" className="size-3.5 shrink-0 rounded-full ring-1 ring-sand-300" />
            {option.title}
          </button>
        ))}
      </div>
    </aside>
  )
}

function MessengerDock() {
  const links = [
    hasContact(contacts.whatsapp) && {
      href: contacts.whatsapp,
      label: 'WhatsApp',
      icon: 'whatsapp' as const,
    },
    hasContact(contacts.telegram) && {
      href: contacts.telegram,
      label: 'Telegram',
      icon: 'telegram' as const,
    },
  ].filter(Boolean) as Array<{ href: string; label: string; icon: 'whatsapp' | 'telegram' }>

  if (links.length === 0) return null

  return (
    <div className="fixed right-4 bottom-4 z-40 flex items-center gap-2 rounded-full bg-white py-2 pr-4 pl-2 shadow-xl shadow-ink-900/15">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Написать в ${link.label}`}
          className="grid size-9 place-items-center rounded-full bg-brand-500 text-white transition-colors hover:bg-brand-600"
        >
          <Icon name={link.icon} />
        </a>
      ))}
      <span className="hidden text-sm whitespace-nowrap text-ink-600 sm:block">
        Мне только спросить
      </span>
    </div>
  )
}

function Icon({ name }: { name: 'whatsapp' | 'telegram' }) {
  if (name === 'telegram') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-4">
        <path d="M21.8 4.3 2.9 11.6c-1 .4-1 1.8 0 2.2l4.6 1.5 1.8 5.5c.3.8 1.3 1 1.9.4l2.6-2.4 4.7 3.5c.7.5 1.7.1 1.9-.7l3.4-15.4c.2-1-.8-1.8-1.8-1.4Zm-3.4 4.2-7.6 6.8c-.3.2-.4.5-.5.9l-.3 2-1.3-4 9.2-6c.4-.2.8.2.5.5Z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-4">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.97L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.13c-.24.68-1.4 1.3-1.93 1.35-.53.05-1.02.24-3.44-.72-2.92-1.15-4.75-4.2-4.9-4.4-.14-.2-1.15-1.53-1.15-2.92 0-1.39.73-2.07 1-2.36.24-.27.53-.34.72-.34.19 0 .38.01.55.01.17 0 .41-.07.64.49.24.58.8 1.97.87 2.11.07.15.12.32.02.51-.1.2-.19.32-.38.5-.19.17-.4.39-.28.6.12.2.53.87 1.14 1.41.78.7 1.44.92 1.64 1.02.19.1.39.09.53-.06.15-.15.63-.73.8-.98.17-.24.34-.2.58-.12.24.1 1.51.71 1.77.84.26.12.43.19.5.29.06.1.06.6-.18 1.27Z" />
    </svg>
  )
}
