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

export const contacts = {
  companyName: 'Жар-Дым',
  tagline: 'Банные чаны от производителя',

  phone: { display: '+7 (966) 666-01-21', href: 'tel:+79666660121' },
  /** The phone number doubles as the WhatsApp contact. */
  whatsapp: 'https://wa.me/79666660121',
  email: 'hottab.hotchan@mail.ru',
  workingHours: 'Ежедневно, 9:00–20:00',

  // Profile URLs are not known yet — the buttons stay hidden until they are.
  telegram: '',
  vk: '',

  addresses: [
    { city: 'Москва', street: 'Очаковское шоссе, 46', role: 'производство и площадка' },
    { city: 'Коркино', street: 'Челябинская обл., ул. 1 Мая, 35В', role: 'производство' },
  ] satisfies Address[],

  legal: {
    entity: 'ИП Вырышева Ю. А.',
    inn: '745301208415',
    // Not known yet.
    ogrnip: '',
  },
} as const

export const hasContact = (value: string) => value.trim().length > 0
