/**
 * The certificates the workshop holds, transcribed from the documents
 * themselves. The PDFs are served from `public/docs`, so a visitor can open
 * the original rather than take the claim on trust.
 */
export interface Certificate {
  title: string
  /** The voluntary certification system that issued it. */
  system: string
  /** Registration number as printed, so it can be checked against the registry. */
  number: string
  /** What the document actually attests, in the visitor's words. */
  summary: string
  validFrom: string
  validUntil: string
  /** File name inside `public/docs`. */
  file: string
}

export const certificates: Certificate[] = [
  {
    title: 'Сертификат соответствия',
    system: 'Система «Промтехстандарт»',
    number: 'РОСС RU.32001.04ИБФ1.ОСП28.85590',
    summary:
      'Банный чан из нержавеющей стали с дровяной печью и увеличенной топкой — по ТУ 27.52.14-001-0147901766-2025.',
    validFrom: '29.09.2025',
    validUntil: '28.09.2028',
    file: 'sertifikat-sootvetstviya-85590.pdf',
  },
  {
    title: 'Экологическая безопасность',
    system: 'Система «Экопромбезопасность»',
    number: 'РОСС RU.32432.04БПЭ0.ОС12.85592',
    summary:
      'Соответствие СТО 32105203-002-2021 «Экологически безопасная продукция. Технические условия».',
    validFrom: '29.09.2025',
    validUntil: '28.09.2028',
    file: 'sertifikat-ekologicheskiy-85592.pdf',
  },
  {
    title: 'Пожарная безопасность',
    system: 'Система сертификации пожарной безопасности',
    number: 'РОСС RU.32079.04СПБ1.ОС14.85591',
    summary: 'Негорючий материал (НГ) по ГОСТ Р 57270—2016.',
    validFrom: '29.09.2025',
    validUntil: '28.09.2028',
    file: 'sertifikat-pozharnyy-85591.pdf',
  },
]

/** Documents live in `public/docs`; the site is served from a sub-path. */
export const docUrl = (name: string) => `${import.meta.env.BASE_URL}docs/${name}`
