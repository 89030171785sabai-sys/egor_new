/**
 * Приём заявок с сайта: заявка уходит в amoCRM (контакт и сделка), по желанию
 * ещё и уведомлением в Telegram. В таблицу ничего не пишется. Если amoCRM не
 * ответила, заявка приходит письмом владельцу скрипта, чтобы её не потерять.
 * Инструкция — docs/zayavki-v-amocrm.md
 *
 * Ключи НЕ пишутся в этот файл. Они лежат в «Свойствах скрипта»
 * (Параметры проекта → Свойства скрипта):
 *   AMO_SUBDOMAIN — часть адреса до .amocrm.ru, например  hottub
 *   AMO_TOKEN     — долгосрочный токен приватной интеграции
 *   AMO_PIPELINE_ID, AMO_STATUS_ID, AMO_USER_ID — необязательные, см. инструкцию
 *   TG_TOKEN, TG_CHAT_ID — по желанию, для уведомлений в Telegram
 */
function doPost(e) {
  const lead = JSON.parse(e.postData.contents)
  const payload = lead.payload || {}

  // 1. amoCRM — главное. Если она не ответила, заявка уходит письмом,
  // иначе её никто бы не увидел.
  try {
    if (!sendToAmo(lead, payload)) throw new Error('не заданы AMO_SUBDOMAIN или AMO_TOKEN')
  } catch (error) {
    console.error('amoCRM: ' + error)
    mailLead(lead, payload, String(error))
  }

  // 2. Telegram — по желанию; его сбой заявке не мешает.
  try {
    notifyTelegram(lead, payload)
  } catch (error) {
    console.error('Telegram: ' + error)
  }

  return ContentService.createTextOutput('ok')
}

/** Письмо владельцу скрипта: заявка, которую не удалось передать в amoCRM. */
function mailLead(lead, payload, reason) {
  const lines = ['Заявка с сайта НЕ попала в amoCRM — внесите её вручную.', 'Причина: ' + reason, '']
  if (lead.name) lines.push('Имя: ' + lead.name)
  if (lead.phone) lines.push('Телефон: ' + lead.phone)
  if (lead.email) lines.push('Email: ' + lead.email)
  if (lead.message) lines.push(lead.message)
  Object.keys(payload).forEach((key) => lines.push(key + ': ' + payload[key]))
  lines.push('Откуда: ' + (SOURCES[lead.source] || lead.source || '—'))
  if (lead.page) lines.push('Страница: ' + lead.page)

  MailApp.sendEmail(Session.getEffectiveUser().getEmail(), 'Заявка с сайта: amoCRM не ответила', lines.join('\n'))
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

/** Заявка → сделка и контакт в amoCRM. Возвращает номер сделки; если amoCRM не настроена — пустую строку. */
function sendToAmo(lead, payload) {
  const props = PropertiesService.getScriptProperties()
  const subdomain = props.getProperty('AMO_SUBDOMAIN')
  const token = props.getProperty('AMO_TOKEN')
  if (!subdomain || !token) return '' // не настроено — просто пропускаем

  const base = 'https://' + subdomain + '.amocrm.ru/api/v4'
  const source = SOURCES[lead.source] || lead.source || 'сайт'

  const contact = { name: lead.name || 'Без имени', custom_fields_values: [] }
  if (lead.phone) {
    contact.custom_fields_values.push({
      field_code: 'PHONE',
      values: [{ value: lead.phone, enum_code: 'WORK' }],
    })
  }
  if (lead.email) {
    contact.custom_fields_values.push({
      field_code: 'EMAIL',
      values: [{ value: lead.email, enum_code: 'WORK' }],
    })
  }

  const deal = {
    name: 'Заявка с сайта: ' + source,
    _embedded: { contacts: [contact], tags: [{ name: 'Сайт' }] },
  }
  const pipeline = props.getProperty('AMO_PIPELINE_ID')
  const status = props.getProperty('AMO_STATUS_ID')
  const user = props.getProperty('AMO_USER_ID')
  if (pipeline) deal.pipeline_id = Number(pipeline)
  if (status) deal.status_id = Number(status)
  if (user) deal.responsible_user_id = Number(user)

  const created = amoRequest(base + '/leads/complex', token, [deal])
  const dealId = created[0] && created[0].id
  if (!dealId) throw new Error('amoCRM не вернула номер сделки')

  // Всё остальное — примечанием к сделке: что выбрал клиент, откуда пришёл.
  const lines = ['Источник: ' + source]
  if (lead.message) lines.push(lead.message)
  Object.keys(payload).forEach((key) => lines.push(key + ': ' + payload[key]))
  if (lead.page) lines.push('Страница: ' + lead.page)
  try {
    amoRequest(base + '/leads/notes', token, [
      { entity_id: dealId, note_type: 'common', params: { text: lines.join('\n') } },
    ])
  } catch (error) {
    console.error('amoCRM, примечание: ' + error) // сделка уже создана, это не критично
  }

  return String(dealId)
}

function amoRequest(url, token, body) {
  const response = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + token },
    payload: JSON.stringify(body),
    muteHttpExceptions: true,
  })
  const code = response.getResponseCode()
  if (code < 200 || code >= 300) {
    throw new Error('HTTP ' + code + ' ' + response.getContentText().slice(0, 300))
  }
  const answer = JSON.parse(response.getContentText() || '{}')
  return Array.isArray(answer) ? answer : (answer._embedded && (answer._embedded.leads || answer._embedded.notes)) || []
}

/** Для проверки вручную: выберите эту функцию вверху и нажмите «Выполнить». */
function testAmo() {
  const id = sendToAmo(
    { name: 'Тест (удалить)', phone: '+7 000 000-00-00', source: 'contacts', page: 'проверка из Apps Script' },
    {},
  )
  console.log(id ? 'Сделка создана, номер ' + id : 'AMO_SUBDOMAIN или AMO_TOKEN не заданы')
}

/** Для проверки вручную: выберите эту функцию вверху и нажмите «Выполнить». */
function testTelegram() {
  notifyTelegram(
    { name: 'Тест', phone: '+7 000 000-00-00', source: 'contacts', page: 'проверка из Apps Script' },
    {},
  )
}
