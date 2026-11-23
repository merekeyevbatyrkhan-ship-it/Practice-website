export const tracks = [
  {
    id: 'vercel', name: 'Vercel', icon: 'vercel', tone: 'neutral', title: 'Деплой на Vercel',
    description: 'Опубликуй сайт, настрой окружения и запусти первую серверную функцию.',
    time: '20–30 мин',
    lessons: [
      {
        id: 'deploy', title: 'Первый деплой',
        intro: 'Подключи репозиторий к Vercel и открой сайт по выданному адресу.',
        steps: [
          'Создай репозиторий на GitHub и загрузи файлы этой папки. Папка public и каталог api должны лежать на одном уровне. Файл .env.local держи у себя.',
          'В панели Vercel выбери Add New → Project и импортируй репозиторий. Укажи корень проекта и пресет Other. Конфигурация vercel.json уже задаёт папку public и отключает шаг сборки.',
          'Нажми Deploy. После завершения открой адрес *.vercel.app, затем путь /api/health и проверь значение ok в ответе.',
        ],
        task: 'Измени заголовок в public/index.html в новой ветке и отправь её на GitHub. Сравни Preview и Production в разделе Deployments.',
        docs: ['Деплой из Git', 'https://vercel.com/docs/git'],
      },
      {
        id: 'environments', title: 'Окружения и функции',
        intro: 'Preview подходит для проверки веток, Production обслуживает основной адрес, Development используется при локальной работе с настройками Vercel.',
        steps: [
          'В Settings → Environment Variables добавь SUPABASE_URL и SUPABASE_PUBLISHABLE_KEY, когда будешь подключать базу. Выбери окружения, где нужны значения.',
          'Сделай новый деплой нужного окружения, чтобы он получил обновлённые переменные. Открой лабораторию на новом адресе и отправь HTTP-запрос.',
          'Открой Logs в панели проекта. Найди запрос по пути /api/health и сравни его HTTP-статус с ответом в лаборатории.',
        ],
        task: 'Добавь в ответ api/health.mjs поле message и проверь, что оно появляется на Preview после пуша.',
        docs: ['Переменные окружения', 'https://vercel.com/docs/environment-variables'],
        action: ['Открыть HTTP-лабораторию', '#lab/api'],
      },
    ],
    features: [
      ['Preview Deployments', 'Отдельные адреса для проверки изменений из веток и pull request.', 'https://vercel.com/docs/deployments/environments'],
      ['Vercel Functions', 'Серверные обработчики. В этом проекте они находятся в каталоге api/.', 'https://vercel.com/docs/functions/runtimes/node-js'],
      ['Runtime Logs', 'Статусы и логи запросов к функциям, полезные при поиске ошибок.', 'https://vercel.com/docs/logs/runtime'],
      ['Domains', 'Подключение собственного адреса и настройка DNS.', 'https://vercel.com/docs/domains'],
      ['Web Analytics', 'Статистика посещений и просмотров страниц после установки счётчика.', 'https://vercel.com/docs/analytics'],
    ],
  },
  {
    id: 'supabase', name: 'Supabase', icon: 'supabase', tone: 'green', title: 'База данных Supabase',
    description: 'Подключи PostgreSQL, прочитай данные через API и разберись с правами доступа.',
    time: '25–35 мин',
    lessons: [
      {
        id: 'connect', title: 'Подключение Supabase',
        intro: 'Сервер будет читать учебную таблицу через Data API Supabase. Для подключения понадобятся URL и publishable key.',
        steps: [
          'Создай учебный проект в Supabase. В окне Connect найди URL проекта и ключ с префиксом sb_publishable_.',
          'Скопируй .env.example в .env.local и подставь реальные значения. Запусти сервер заново командой из примера.',
          'Выполни шаг «Таблицы и политики RLS», затем открой проверку подключения в лаборатории. При рабочей конфигурации появятся шесть учебных строк.',
        ],
        code: ['PowerShell', 'Copy-Item .env.example .env.local\n# Подставь URL и publishable key в .env.local\nnode server.mjs'],
        task: 'Проверь подключение локально. Для проверки на Vercel задай те же переменные в нужном окружении и создай новый деплой.',
        docs: ['Ключи Supabase', 'https://supabase.com/docs/guides/getting-started/api-keys'],
        action: ['Проверить подключение', '#lab/supabase'],
      },
      {
        id: 'policies', title: 'Таблицы и политики RLS',
        intro: 'Разрешение GRANT определяет операции над таблицей, а политики RLS определяют, к каким строкам роль получит доступ.',
        steps: [
          'Открой SQL Editor в учебном проекте Supabase. Вставь SQL из файла ниже и запусти его. Скрипт создаёт таблицу practice_topics и добавляет шесть примеров.',
          'Открой Table Editor и посмотри столбцы id, title, platform и done. Роль anon получает право SELECT, а политика practice_topics_anon_read открывает ей учебные строки.',
          'Проверь чтение из лаборатории. Для приватных данных сначала настрой Supabase Auth, затем добавь RLS-политику с проверкой владельца через auth.uid().',
        ],
        task: 'В SQL Editor выполни SELECT title FROM public.practice_topics WHERE platform = \'Supabase\'; и сравни результат с учебным запросом WHERE.',
        docs: ['Доступ к Data API и RLS', 'https://supabase.com/docs/guides/api/securing-your-api'],
        action: ['Скачать SQL для таблицы', '/practice-topics.sql', 'download'],
      },
    ],
    features: [
      ['Postgres и Data API', 'Создавай таблицы в PostgreSQL и обращайся к ним через REST.', 'https://supabase.com/docs/guides/api'],
      ['Auth', 'Добавляй вход по email и внешним провайдерам, используй идентификатор пользователя в RLS.', 'https://supabase.com/docs/guides/auth'],
      ['Storage', 'Храни файлы в бакетах и управляй доступом к объектам через политики.', 'https://supabase.com/docs/guides/storage'],
      ['Realtime', 'Получай обновления данных и сообщения через подписки в реальном времени.', 'https://supabase.com/docs/guides/realtime'],
      ['Edge Functions', 'Запускай обработчики TypeScript, например для приёма вебхуков.', 'https://supabase.com/docs/guides/functions'],
    ],
  },
  {
    id: 'practice', name: 'Практика', icon: 'flask', tone: 'purple', title: 'От теории к практике',
    description: 'Запусти SQL-запросы и проследи путь данных от API до страницы.',
    time: '15–25 мин',
    lessons: [
      {
        id: 'sql', title: 'Первые запросы SQL',
        intro: 'Лаборатория запускает готовые запросы в SQLite. Для этих упражнений в PostgreSQL используются те же команды SELECT, WHERE и GROUP BY.',
        steps: [
          'Открой вкладку SQL и выполни запрос SELECT. Сравни столбцы в таблице с теми, что перечислены в запросе.',
          'Выбери WHERE, поменяй платформу и посмотри, как изменится выборка.',
          'Запусти GROUP BY и сравни итоговое число тем по платформам с результатом SELECT.',
        ],
        task: 'Предскажи результаты всех трёх запросов и только потом нажми «Выполнить запрос».',
        docs: ['Упражнения SQLBolt', 'https://sqlbolt.com/'],
        action: ['Открыть SQL-лабораторию', '#lab/sql'],
      },
      {
        id: 'web-flow', title: 'От запроса до интерфейса',
        intro: 'Браузер обращается к серверу через fetch, получает JSON и выводит результат на страницу.',
        steps: [
          'Открой DevTools → Network и отправь запрос в HTTP-лаборатории. Найди /api/health и изучи вкладки Headers и Response.',
          'Переключи метод запроса с GET на POST. Сравни успешный ответ со статусом 405 и найди заголовок Allow.',
          'Открой public/app.js и api/health.mjs. Сопоставь кнопку запроса, путь API и данные, которые вернул обработчик.',
        ],
        task: 'Собери страницу со списком тем, используя ответ /api/sql?query=select. Добавь состояния загрузки и ошибки.',
        docs: ['Fetch API на MDN', 'https://developer.mozilla.org/ru/docs/Web/API/Fetch_API'],
        action: ['Открыть HTTP-лабораторию', '#lab/api'],
      },
    ],
    features: [],
  },
];

export const resources = [
  { name: 'MDN Web Docs', icon: 'book', color: 'blue', category: 'learn', tag: 'Справочник', url: 'https://developer.mozilla.org/ru/', text: 'Справочник по HTML, CSS, JavaScript и API браузера.' },
  { name: 'VS Code', icon: 'code', color: 'blue', category: 'tools', tag: 'Редактор', url: 'https://code.visualstudio.com/', text: 'Редактируй код, запускай команды в терминале и работай с Git.' },
  { name: 'GitHub Skills', icon: 'git', color: 'purple', category: 'learn', tag: 'Практика Git', url: 'https://learn.github.com/skills', text: 'Освой ветки, коммиты и pull request на интерактивных упражнениях.' },
  { name: 'Frontend Mentor', icon: 'layout', color: 'green', category: 'learn', tag: 'Вёрстка', url: 'https://www.frontendmentor.io/challenges', text: 'Сверстай сайт по готовому макету и сравни своё решение с другими.' },
  { name: 'Chrome DevTools', icon: 'terminal', color: 'purple', category: 'tools', tag: 'Отладка', url: 'https://developer.chrome.com/docs/devtools', text: 'Исследуй CSS, смотри HTTP-запросы и проверяй мобильную вёрстку.' },
  { name: 'Postman', icon: 'send', color: 'orange', category: 'tools', tag: 'HTTP API', url: 'https://www.postman.com/', text: 'Отправляй запросы к API и сохраняй их в коллекции.' },
  { name: 'SQLBolt', icon: 'database', color: 'green', category: 'learn', tag: 'SQL', url: 'https://sqlbolt.com/', text: 'Попрактикуй SELECT, JOIN и агрегации в браузере.' },
  { name: 'Figma', icon: 'layout', color: 'orange', category: 'tools', tag: 'Дизайн', url: 'https://www.figma.com/design/', text: 'Проектируй интерфейс перед вёрсткой и измеряй отступы.' },
  { name: 'freeCodeCamp', icon: 'code', color: 'blue', category: 'learn', tag: 'Курсы', url: 'https://www.freecodecamp.org/learn/', text: 'Изучай основы и закрепляй их на проектах по веб-разработке.' },
  { name: 'roadmap.sh', icon: 'map', color: 'purple', category: 'learn', tag: 'План обучения', url: 'https://roadmap.sh/frontend', text: 'Посмотри, какие темы входят во фронтенд и в каком порядке их изучать.' },
  { name: 'Lighthouse', icon: 'chart', color: 'green', category: 'tools', tag: 'Аудит', url: 'https://developer.chrome.com/docs/lighthouse/overview/', text: 'Проверь скорость, доступность и базовые настройки SEO.' },
  { name: 'Can I Use', icon: 'check', color: 'orange', category: 'tools', tag: 'Совместимость', url: 'https://caniuse.com/', text: 'Узнай, какие браузеры поддерживают нужные возможности CSS и Web API.' },
];
