import { useId, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'
import { ChannelSwitch, Field, Input, Select } from './Field'
import { formatPhone, isPhoneComplete } from '../../lib/phone'
import { submitLead, type LeadSource } from '../../lib/leads'

export type FieldName = 'name' | 'phone' | 'city' | 'budget' | 'channel'

export type Channel = 'phone' | 'telegram' | 'email'

const channelOptions: Array<{ id: Channel; label: string }> = [
  { id: 'phone', label: 'Телефон' },
  { id: 'telegram', label: 'Telegram' },
  { id: 'email', label: 'Почта' },
]

const budgets = ['до 300 000 ₽', 'до 500 000 ₽', 'до 800 000 ₽', 'более 800 000 ₽']

interface Values {
  name: string
  phone: string
  city: string
  budget: string
  channel: Channel
  /** Telegram handle or e-mail, depending on the chosen channel. */
  handle: string
}

const emptyValues: Values = {
  name: '',
  phone: '',
  city: '',
  budget: budgets[0],
  channel: 'phone',
  handle: '',
}

/**
 * One form behind every request on the site. `fields` decides which controls
 * appear, so the four variants on the page are four configurations rather than
 * four components. Submission goes through `submitLead`, the single point where
 * a CRM gets wired in.
 */
export function LeadForm({
  source,
  fields = ['name', 'phone'],
  submitLabel = 'Оставить заявку',
  payload,
  successNote = 'Заявка отправлена. Свяжемся в ближайшее время.',
  consent = true,
  className = '',
}: {
  source: LeadSource
  fields?: FieldName[]
  submitLabel?: string
  /** Extra context sent with the lead, e.g. the chosen configuration. */
  payload?: Record<string, string | number | boolean>
  successNote?: ReactNode
  consent?: boolean
  className?: string
}) {
  const [values, setValues] = useState<Values>(emptyValues)
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({})
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const formId = useId()

  const has = (field: FieldName) => fields.includes(field)
  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const usesHandle = has('channel') && values.channel !== 'phone'

  function validate() {
    const found: Partial<Record<keyof Values, string>> = {}

    if (has('name') && values.name.trim().length < 2) found.name = 'Укажите имя'

    if (usesHandle) {
      if (values.channel === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.handle)) {
        found.handle = 'Укажите почту в формате name@mail.ru'
      }
      if (values.channel === 'telegram' && values.handle.trim().length < 3) {
        found.handle = 'Укажите ник в Telegram'
      }
    } else if (has('phone') || has('channel')) {
      if (!isPhoneComplete(values.phone)) found.phone = 'Укажите телефон полностью'
    }

    setErrors(found)
    return Object.keys(found).length === 0
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!validate()) return

    setState('submitting')
    const result = await submitLead({
      source,
      name: has('name') ? values.name.trim() : undefined,
      phone: usesHandle ? '' : values.phone,
      email: values.channel === 'email' ? values.handle.trim() : undefined,
      message: values.channel === 'telegram' ? `Telegram: ${values.handle.trim()}` : undefined,
      payload: {
        ...payload,
        ...(has('city') && values.city ? { Город: values.city } : {}),
        ...(has('budget') ? { Бюджет: values.budget } : {}),
      },
    })

    setState(result.ok ? 'success' : 'error')
  }

  if (state === 'success') {
    return (
      <div className={`rounded-panel bg-brand-50 p-6 text-center ${className}`}>
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-brand-500 text-white">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6">
            <path
              d="m5 13 4.5 4.5L19 8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <p className="mt-4 text-lg font-semibold">Готово</p>
        <p className="mt-2 text-sm text-ink-500">{successNote}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={className}>
      {has('channel') && (
        <div className="mb-4">
          <p className="mb-2 text-sm font-semibold">Как с вами связаться?</p>
          <ChannelSwitch
            value={values.channel}
            options={channelOptions}
            onChange={(channel) => set('channel', channel)}
          />
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {has('name') && (
          <Field label="Введите имя" error={errors.name} className="sm:col-span-2">
            <Input
              name="name"
              autoComplete="name"
              placeholder="Как к вам обращаться"
              value={values.name}
              onChange={(event) => set('name', event.target.value)}
            />
          </Field>
        )}

        {usesHandle ? (
          <Field
            label={values.channel === 'telegram' ? 'Ник в Telegram' : 'Электронная почта'}
            error={errors.handle}
            className="sm:col-span-2"
          >
            <Input
              name={values.channel === 'telegram' ? 'telegram' : 'email'}
              inputMode={values.channel === 'email' ? 'email' : 'text'}
              autoComplete={values.channel === 'email' ? 'email' : 'off'}
              placeholder={values.channel === 'telegram' ? '@nickname' : 'name@mail.ru'}
              value={values.handle}
              onChange={(event) => set('handle', event.target.value)}
            />
          </Field>
        ) : (
          (has('phone') || has('channel')) && (
            <Field label="Введите телефон" error={errors.phone} className="sm:col-span-2">
              <Input
                name="phone"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+7 (___) ___-__-__"
                value={values.phone}
                onChange={(event) => set('phone', formatPhone(event.target.value))}
              />
            </Field>
          )
        )}

        {has('city') && (
          <Field label="Населённый пункт" error={errors.city}>
            <Input
              name="city"
              autoComplete="address-level2"
              placeholder="Москва"
              value={values.city}
              onChange={(event) => set('city', event.target.value)}
            />
          </Field>
        )}

        {has('budget') && (
          <Field label="Примерный бюджет">
            <Select
              name="budget"
              value={values.budget}
              onChange={(event) => set('budget', event.target.value)}
            >
              {budgets.map((budget) => (
                <option key={budget} value={budget}>
                  {budget}
                </option>
              ))}
            </Select>
            <ChevronIcon />
          </Field>
        )}
      </div>

      <Button type="submit" size="lg" arrow className="mt-4 w-full" disabled={state === 'submitting'}>
        {state === 'submitting' ? 'Отправляем…' : submitLabel}
      </Button>

      {state === 'error' && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          Не удалось отправить заявку. Позвоните нам или попробуйте ещё раз.
        </p>
      )}

      {consent && (
        <p id={formId} className="mt-3 text-xs leading-relaxed text-ink-400">
          Нажимая кнопку, вы соглашаетесь на{' '}
          <Link to="/personal-data" className="underline hover:text-ink-600">
            обработку персональных данных
          </Link>{' '}
          на условиях{' '}
          <Link to="/privacy" className="underline hover:text-ink-600">
            политики конфиденциальности
          </Link>
          .
        </p>
      )}
    </form>
  )
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" className="ml-2 size-3 shrink-0 text-ink-400">
      <path
        d="m3 5 3 3 3-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
