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
  /**
   * Page the document starts on, where its file holds more than one. The
   * ecological certificate and the permission to display its mark are two
   * registrations issued together and scanned into a single PDF.
   */
  page?: number
  /**
   * First page of the document, drawn by
   * `scripts/render-certificate-previews.py` into `public/photos`.
   */
  preview: string
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
    preview: 'cert-sootvetstviya.webp',
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
    preview: 'cert-ekologicheskiy.webp',
  },
  {
    title: 'Разрешение на знак',
    system: 'Система «Экопромбезопасность»',
    number: 'РОСС RU.32432.04БПЭ0.ОС12.85592Р',
    summary:
      'Право наносить знак соответствия экологическим требованиям на продукцию, упаковку и рекламные материалы.',
    validFrom: '29.09.2025',
    validUntil: '28.09.2028',
    file: 'sertifikat-ekologicheskiy-85592.pdf',
    page: 2,
    preview: 'cert-eko-znak.webp',
  },
  {
    title: 'Пожарная безопасность',
    system: 'Система сертификации пожарной безопасности',
    number: 'РОСС RU.32079.04СПБ1.ОС14.85591',
    summary: 'Негорючий материал (НГ) по ГОСТ Р 57270—2016.',
    validFrom: '29.09.2025',
    validUntil: '28.09.2028',
    file: 'sertifikat-pozharnyy-85591.pdf',
    preview: 'cert-pozharnyy.webp',
  },
]

/**
 * Documents live in `public/docs`; the site is served from a sub-path.
 *
 * A certificate that starts partway into its file carries the page in the
 * fragment, which every PDF viewer in a browser understands — so the link
 * opens on the document named on the card rather than on the one before it.
 */
export const certificateUrl = (item: Certificate) =>
  `${import.meta.env.BASE_URL}docs/${item.file}${item.page ? `#page=${item.page}` : ''}`
