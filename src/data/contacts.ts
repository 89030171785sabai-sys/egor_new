/**
 * Single source of truth for contact details, rendered by the header, footer,
 * contacts page and every form. Values below are placeholders: they must be
 * replaced with the real details before launch.
 */
export const contacts = {
  companyName: 'Дым и Пар',
  tagline: 'Банные чаны от производителя',
  phone: { display: '', href: '' },
  email: '',
  whatsapp: '',
  telegram: '',
  address: '',
  workingHours: '',
  legal: { entity: '', inn: '', ogrn: '' },
  social: [] as Array<{ label: string; href: string }>,
} as const

export const hasContact = (value: string) => value.trim().length > 0
