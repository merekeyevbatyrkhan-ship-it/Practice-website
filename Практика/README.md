# DevПрактика

Учебная площадка с шестью заданиями по деплою на Vercel, подключению Supabase, SQL и работе с HTTP. Прогресс хранится в браузере для каждого адреса сайта.

## Запуск на Windows

Открой PowerShell в папке проекта. Для запуска нужен [Node.js 24](https://nodejs.org/en/download). Установка npm-пакетов не требуется.

```powershell
node server.mjs
```

Открой [http://127.0.0.1:3000](http://127.0.0.1:3000). Остановка сервера — `Ctrl+C`. Если порт занят, задай `$env:PORT = '3001'` перед запуском и открой адрес, напечатанный в терминале.

HTTP API, SQL-лаборатория и все уроки доступны сразу. SQL-лаборатория выполняет готовые запросы в SQLite с отдельным набором учебных данных для каждого запроса.

## Подключение Supabase

1. Создай учебный проект в Supabase. В окне **Connect** найди адрес вида `https://<ref>.supabase.co` и ключ с префиксом `sb_publishable_`. [Ключи API](https://supabase.com/docs/guides/getting-started/api-keys)
2. В PowerShell выполни `Copy-Item .env.example .env.local` и подставь адрес и ключ в `.env.local`.
3. Открой **SQL Editor** в Supabase и выполни содержимое [public/practice-topics.sql](public/practice-topics.sql). Скрипт создаёт таблицу, добавляет учебные строки и даёт роли `anon` доступ на чтение с политикой RLS. Используй эту таблицу для общедоступных учебных данных. [Настройка доступа к Data API](https://supabase.com/docs/guides/api/securing-your-api)
4. Перезапусти сервер и выбери **Лаборатория → Подключение Supabase → Проверить подключение**. При успешном запросе появятся строки из PostgreSQL.

## Публикация на Vercel

1. Загрузи проект в репозиторий GitHub. `.gitignore` исключает `.env.local` и оставляет в репозитории шаблон `.env.example`.
2. В Vercel создай проект из репозитория. Выбери пресет **Other**. В `vercel.json` задана папка `public` и отключена сборка. Vercel развернёт файлы из `api/` как серверные функции. [Деплой из Git](https://vercel.com/docs/git) · [Функции Node.js](https://vercel.com/docs/functions/runtimes/node-js)
3. Для Supabase добавь `SUPABASE_URL` и `SUPABASE_PUBLISHABLE_KEY` в **Settings → Environment Variables**, выбери нужные окружения и создай новый деплой. [Переменные окружения Vercel](https://vercel.com/docs/environment-variables)
4. Открой адрес деплоя, проверь `/api/health` и пройди упражнения в лаборатории.

## Где менять код

| Файл | Что в нём |
| --- | --- |
| `public/index.html` | Разметка и навигация |
| `public/styles.css` | Оформление и адаптивная вёрстка |
| `public/content.js` | Уроки и ресурсы |
| `public/app.js` | Поиск, чек-листы, вкладки и запросы из браузера |
| `public/sql-examples.js` | SQL-запросы и пояснения к ним |
| `api/*.mjs` | Серверные функции для локального запуска и Vercel |
| `server.mjs` | Локальный HTTP-сервер |
