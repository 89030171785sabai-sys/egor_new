/**
 * Приём заявок с сайта: запись в Google-таблицу и уведомление в Telegram.
 * Вставляется в Apps Script таблицы (Расширения → Apps Script).
 * Инструкции — в docs/zayavki-v-google-tablitsu.md и docs/zayavki-v-telegram.md
 *
 * Токен бота и номер чата НЕ пишутся в этот файл. Они лежат в «Свойствах скрипта»
 * (Параметры проекта → Свойства скрипта): TG_TOKEN и TG_CHAT_ID.
 */
const SHEET_NAME = 'Заявки'

function doPost(e) {
  const lead = JSON.parse(e.postData.contents)

  // 1. Таблица — главное, делается первой.
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

  // 2. Telegram. Если он не ответил, заявка в таблице всё равно сохранена.
  try {
    notifyTelegram(lead, payload)
  } catch (error) {
    console.error('Telegram: ' + error)
  }

  return ContentService.createTextOutput('ok')
}

const SOURCES = {
  'header-callback': 'Обратный звонок (шапка)',
  hero: 'Первый экран',
  product: 'Страница модели',
  calculator: 'Калькулятор',
  quiz: 'Опросник',
  contacts: 'Контакты',
  footer: 'Подвал сайта',
}

function escapeHtml(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function notifyTelegram(lead, payload) {
  const props = PropertiesService.getScriptProperties()
  const token = props.getProperty('TG_TOKEN')
  const chatId = props.getProperty('TG_CHAT_ID')
  if (!token || !chatId) return // не настроено — просто пропускаем

  const lines = ['<b>Новая заявка с сайта</b>']
  if (lead.name) lines.push('Имя: ' + escapeHtml(lead.name))
  if (lead.phone) lines.push('Телефон: ' + escapeHtml(lead.phone))
  if (lead.message) lines.push(escapeHtml(lead.message))
  Object.keys(payload).forEach((key) => lines.push(escapeHtml(key) + ': ' + escapeHtml(payload[key])))
  lines.push('Откуда: ' + escapeHtml(SOURCES[lead.source] || lead.source || '—'))
  if (lead.page) lines.push(escapeHtml(lead.page))

  UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
    method: 'post',
    contentType: 'application/json',
    muteHttpExceptions: true,
    payload: JSON.stringify({
      chat_id: chatId,
      text: lines.join('\n'),
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  })
}

/** Для проверки вручную: выберите эту функцию вверху и нажмите «Выполнить». */
function testTelegram() {
  notifyTelegram(
    { name: 'Тест', phone: '+7 000 000-00-00', source: 'contacts', page: 'проверка из Apps Script' },
    {},
  )
}
