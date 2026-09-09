# Жар-Дым — сайт производителя банных чанов

Многостраничный сайт на React + TypeScript + Vite + Tailwind CSS v4.
Каждая страница имеет собственный URL, уникальные `title`/`description` и canonical.

## Команды

```bash
npm install
npm run dev        # локальный сервер разработки
npm run build      # production-сборка в dist/
npm run preview    # предпросмотр собранной версии
npm run typecheck  # проверка типов
```

## Структура

```
src/
  components/layout/  Header, Footer, Layout — общие для всех страниц
  components/ui/      переиспользуемые элементы интерфейса
  pages/              страницы, по одной на маршрут
  lib/routes.ts       карта маршрутов: путь, заголовок, description, пункт меню
  lib/seo.ts          установка title/description/canonical для страницы
  lib/leads.ts        отправка заявок — единая точка подключения CRM
  lib/phone.ts        маска и валидация телефона
  data/contacts.ts    контактные данные (одна точка правды)
  styles/index.css    дизайн-токены: цвета, шрифты, радиусы, ширина контента
```

## Подключение CRM

Все формы отправляются через `submitLead` из `src/lib/leads.ts`.
Пока переменная `VITE_LEADS_ENDPOINT` не задана, заявка не уходит наружу,
а интерфейс отрабатывает состояние успеха. Для подключения реальной системы
достаточно задать адрес в `.env`:

```
VITE_LEADS_ENDPOINT=https://example.com/api/leads
```

Менять компоненты форм при этом не требуется.

## Что осталось заполнить

- `src/data/contacts.ts` — телефон, мессенджеры, адрес, реквизиты;
- контентные блоки страниц;
- реальные фотографии изделий.
