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
  id: 'telegram' | 'vk' | 'rutube'
  label: string
  href: string
}

export const contacts = {
  companyName: 'HOTTUB',
  tagline: 'Горячий чан — банные чаны от производителя',

  /** The only number that is answered by voice. */
  phone: { display: '+7 (980) 900-81-30', href: 'tel:+79809008130' },

  /**
   * Messenger numbers. Empty on purpose: the client dropped WhatsApp, Telegram
   * and MAX from the site, and with an empty list the floating chat button and
   * the messenger row on the contacts page do not render.
   */
  messengers: [] as Messenger[],

  /** Public pages, as opposed to the messenger numbers above. */
  social: [
    { id: 'vk', label: 'ВКонтакте', href: 'https://vk.ru/hottub_hotchan' },
    { id: 'rutube', label: 'RuTube', href: 'https://rutube.ru/channel/58967609/' },
  ] satisfies Social[],

  workingHours: 'Ежедневно, 9:00–20:00',

  addresses: [
    { city: 'Москва', street: 'Очаковское шоссе, 46', role: 'производство и площадка' },
    { city: 'Коркино', street: 'Челябинская обл., ул. 1 Мая, 35В', role: 'производство' },
  ] satisfies Address[],

  /** The domain the site will live on, as the legal documents name it. */
  site: 'хоттаб-чан.рф',

  /** Written address for legal notices and for withdrawing consent. */
  email: 'hottab.hotchan@mail.ru',

  legal: {
    entity: 'ИП Вырышева Ю. А.',
    /** Full form, as the certificates and the legal documents spell it. */
    entityFull: 'Индивидуальный предприниматель Вырышева Юлия Александровна',
    /** Registered address, read off the certificates of conformity. */
    address: '454000, Челябинская область, г. Челябинск, ул. Рубиновая, д. 21',
    inn: '745301208415',
    // Both read off the certificates of conformity in `public/docs`.
    ogrnip: '319745600041392',
  },
} as const

export const hasContact = (value: string) => value.trim().length > 0

/** Wording used everywhere a messenger number is shown. */
export const MESSENGER_NOTE = 'только сообщения — на звонки по этим номерам не отвечаем'
