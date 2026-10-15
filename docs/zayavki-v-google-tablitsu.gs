/**
 * Приём заявок с сайта в Google-таблицу.
 * Вставляется в Apps Script таблицы (Расширения → Apps Script),
 * затем «Развернуть → Веб-приложение». Инструкция — в docs/zayavki-v-google-tablitsu.md
 */
const SHEET_NAME = 'Заявки'

function doPost(e) {
  const lead = JSON.parse(e.postData.contents)
  const sheet =
    SpreadsheetApp.getActive().getSheetByName(SHEET_NAME) ||
    SpreadsheetApp.getActive().insertSheet(SHEET_NAME)

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Дата', 'Откуда', 'Имя', 'Телефон', 'Город / сообщение', 'Что выбрал', 'Страница'])
    sheet.setFrozenRows(1)
  }

  const payload = lead.payload || {}
  const details = Object.keys(payload)
    .map((key) => key + ': ' + payload[key])
    .join('\n')

  sheet.appendRow([
    new Date(lead.sentAt),
    lead.source || '',
    lead.name || '',
    "'" + (lead.phone || ''), // апостроф, чтобы таблица не превратила номер в формулу
    lead.message || payload['Город'] || '',
    details,
    lead.page || '',
  ])

  return ContentService.createTextOutput('ok')
}
