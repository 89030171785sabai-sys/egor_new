/**
 * Single source of truth for contact details, rendered by the header, footer,
 * contacts block and every form.
 */
export interface Address {
  city: string
  street: string
  /** What is at this address, shown as a caption under it. */
  role: string
}

export interface Messenger {
  id: 'whatsapp' | 'telegram' | 'max'
  label: string
  /** Number shown to the visitor. */
  display: string
  href: string
}

export interface Social {
  id: 'telegram' | 'vk'
  label: string
  href: string
}

export const contacts = {
  companyName: 'Дым и Пар',
  tagline: 'Банные чаны от производителя',

  /** The only number that is answered by voice. */
  phone: { display: '+7 (980) 900-81-30', href: 'tel:+79809008130' },

  /**
   * Messenger numbers. Nobody picks up a call on these — the site says so
   * wherever they appear, so a visitor does not waste a call.
   */
  messengers: [
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      display: '8 (916) 587-76-52',
      href: 'https://wa.me/79165877652',
    },
    {
      id: 'telegram',
      label: 'Telegram',
      display: '+7 (922) 711-14-03',
      href: 'https://t.me/+79227111403',
    },
    {
      id: 'max',
      label: 'MAX',
      display: '+7 (950) 815-82-43',
      href: 'https://max.ru/+79508158243',
    },
  ] satisfies Messenger[],

  /** Public pages, as opposed to the messenger numbers above. */
  social: [
    { id: 'telegram', label: 'Telegram-канал', href: 'https://t.me/HOTTUB_Chan' },
    { id: 'vk', label: 'ВКонтакте', href: 'https://vk.ru/hottub_hotchan' },
  ] satisfies Social[],

  workingHours: 'Ежедневно, 9:00–20:00',

  addresses: [
    { city: 'Москва', street: 'Очаковское шоссе, 46', role: 'производство и площадка' },
    { city: 'Коркино', street: 'Челябинская обл., ул. 1 Мая, 35В', role: 'производство' },
  ] satisfies Address[],

  legal: {
    entity: 'ИП Вырышев Егор Максимович',
    inn: '745307026884',
    ogrnip: '323745600126642',
  },
} as const

export const hasContact = (value: string) => value.trim().length > 0

/** Wording used everywhere a messenger number is shown. */
export const MESSENGER_NOTE = 'только сообщения — на звонки по этим номерам не отвечаем'
