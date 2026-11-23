import { tracks, resources } from './content.js';
import { queries } from './sql-examples.js';

const icons = {
  terminal: '<path d="m5 7 5 5-5 5m8 0h6"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  vercel: '<path d="M12 3 22 20H2L12 3Z" fill="currentColor" stroke="none"/>',
  supabase: '<path d="M13 2 3 14h8l-.2 8L21 10h-8l.2-8Z" fill="currentColor" stroke="none"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2ZM8 7h8m-8 4h6"/>',
  flask: '<path d="M9 3h6m-5 0v7l-5.2 8.1A1.9 1.9 0 0 0 6.4 21h11.2a1.9 1.9 0 0 0 1.6-2.9L14 10V3M8 15h8"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5 9-5Zm9 9-9 5-9-5m18 4-9 5-9-5"/>',
  chart: '<path d="M4 19V5m0 14h16M9 15v-3m5 3V8m5 7V5"/>',
  'hard-drive': '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 13h18m-13 3h.01m4 0h.01"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',
  'chevron-right': '<path d="m9 18 6-6-6-6"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  external: '<path d="M13 5h6v6m0-6-8 8m-1-7H5v13h13v-5"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  x: '<path d="m6 6 12 12M18 6 6 18"/>',
  code: '<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  play: '<path d="m8 5 12 7-12 7V5Z" fill="currentColor" stroke="none"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  git: '<circle cx="6" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="7" r="2"/><path d="M6 8v8m12-7a7 7 0 0 1-7 7H6"/>',
  layout: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18m-12 0v11"/>',
  send: '<path d="m22 2-7 20-4-9-9-4 20-7ZM22 2 11 13"/>',
  database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  map: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Zm6-3v15m6-12v15"/>',
  download: '<path d="M12 3v12m-4-4 4 4 4-4M4 16v4h16v-4"/>',
  plug: '<path d="M8 3v5m8-5v5M6 8h12v4a6 6 0 0 1-12 0V8Zm6 10v3"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
};

const pageLabels = { home: 'Обзор', vercel: 'Vercel', supabase: 'Supabase', practice: 'Практика', lab: 'Лаборатория', resources: 'Ресурсы' };
const labs = [
  { id: 'api', name: 'HTTP API', icon: 'terminal' },
  { id: 'sql', name: 'SQL', icon: 'database' },
  { id: 'supabase', name: 'Подключение Supabase', icon: 'plug' },
];
const filters = { all: 'Все', learn: 'Обучение', tools: 'Инструменты' };
const allLessons = tracks.flatMap(track => track.lessons);
const main = document.querySelector('#main');
const dialog = document.querySelector('.search-dialog');
const searchInput = document.querySelector('#search-input');
const menuButton = document.querySelector('[data-menu]');
const menuOverlay = document.querySelector('.menu-overlay');
const progressKey = 'dev-praktika-lessons-v1';
const completed = readProgress();
let toastTimeout;

function icon(name) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${icons[name]}</svg>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

function readProgress() {
  try {
    const stored = JSON.parse(localStorage.getItem(progressKey) ?? '[]');
    return new Set(Array.isArray(stored) ? stored.filter(id => allLessons.some(lesson => lesson.id === id)) : []);
  } catch {
    return new Set();
  }
}

function progressMarkup(count, total) {
  return `<progress value="${count}" max="${total}" aria-label="Выполнено ${count} из ${total} шагов"></progress>`;
}

function nextLessonLink() {
  const nextTrack = tracks.find(track => track.lessons.some(lesson => !completed.has(lesson.id)));
  if (!nextTrack) return '#practice';
  return `#${nextTrack.id}/${nextTrack.lessons.find(lesson => !completed.has(lesson.id)).id}`;
}

function externalLink(label, href, className = 'text-link') {
  return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="${className}">${escapeHtml(label)} ${icon('external')}</a>`;
}

function codeBlock(language, code) {
  return `<div class="code-block">
    <div class="code-toolbar"><span>${escapeHtml(language)}</span><button type="button" class="icon-button" data-copy aria-label="Скопировать код" title="Скопировать код">${icon('copy')}</button></div>
    <pre><code>${escapeHtml(code)}</code></pre>
  </div>`;
}

function renderHome() {
  return `<section class="hero" aria-labelledby="home-title">
    <div class="hero-content">
      <p class="hero-kicker">${icon('code')} <span>ВЕБ-РАЗРАБОТКА</span></p>
      <h1 id="home-title">Учись делать<br><em>сайты на практике.</em></h1>
      <p class="hero-description">От первого деплоя до своей базы данных. Освой Vercel и Supabase шаг за шагом и проверяй результат в лаборатории.</p>
      <div class="actions hero-actions">
        <a class="button primary" href="${nextLessonLink()}">${icon('play')} ${completed.size ? 'Продолжить обучение' : 'Начать обучение'}</a>
        <a class="button secondary" href="#lab/api">${icon('flask')} Лаборатория</a>
      </div>
    </div>
    <div class="hero-art">
      <div class="terminal-example" aria-label="Пример запуска локального сервера">
        <div class="terminal-bar"><span class="terminal-dots" aria-hidden="true"><i></i><i></i><i></i></span><span>Терминал</span><button type="button" class="icon-button" data-copy-value="node server.mjs" aria-label="Скопировать команду запуска" title="Скопировать команду запуска">${icon('copy')}</button></div>
        <div class="terminal-body">
          <div><span class="prompt">$</span> node server.mjs</div>
          <div class="terminal-output"><span>✓</span> Сервер запущен</div>
          <div class="terminal-address"><span>›</span> <span class="terminal-url">http://127.0.0.1:3000</span></div>
          <div class="terminal-next"><span class="prompt">$</span> <span class="cursor" aria-hidden="true"></span></div>
        </div>
        <div class="terminal-footer"><span class="terminal-dot"></span> Локальный запуск <span class="terminal-version">Node.js 24</span></div>
      </div>
    </div>
  </section>
  <section class="overview-section" aria-labelledby="route-heading">
    <div class="section-heading"><div><h2 id="route-heading">Маршрут обучения</h2><p>Короткие гайды и задания, которые можно выполнить в этом проекте.</p></div>
      <div class="overview-progress"><span>${completed.size} из ${allLessons.length} шагов</span>${progressMarkup(completed.size, allLessons.length)}</div>
    </div>
    <div class="track-grid">${tracks.map(trackCard).join('')}</div>
  </section>
  <section class="overview-section overview-resources" aria-labelledby="resources-heading">
    <div class="section-heading"><div><h2 id="resources-heading">Полезные ресурсы</h2><p>Справочники, инструменты и тренажёры для следующих проектов.</p></div><a class="text-link" href="#resources">Все ресурсы ${icon('layers')}</a></div>
    <div class="resource-strip">${resources.slice(0, 4).map(resource => `<a class="resource-chip" href="${resource.url}" target="_blank" rel="noopener noreferrer"><span class="mini-icon ${resource.color}">${icon(resource.icon)}</span><span><strong>${resource.name}</strong><small>${resource.tag}</small></span>${icon('external')}</a>`).join('')}</div>
  </section>`;
}

function trackCard(track) {
  const done = track.lessons.filter(lesson => completed.has(lesson.id)).length;
  return `<a class="track-card ${track.tone}" href="#${track.id}">
    <div class="track-top"><span class="track-icon ${track.tone}">${icon(track.icon)}</span></div>
    <h3>${track.title}</h3><p>${track.description}</p>
    <div class="track-footer"><span>${icon('clock')} ${track.time}</span><span>${icon(done === track.lessons.length ? 'check' : 'book')} ${done ? `${done} из ${track.lessons.length}` : `${track.lessons.length} шага`}</span></div>
  </a>`;
}

function renderTrack(track, detail) {
  const count = track.lessons.filter(lesson => completed.has(lesson.id)).length;
  const firstOpen = track.lessons.find(lesson => lesson.id === detail) ?? track.lessons.find(lesson => !completed.has(lesson.id)) ?? track.lessons[0];
  return `<section class="page-heading track-heading ${track.tone}">
    <span class="track-icon ${track.tone}">${icon(track.icon)}</span><div><h1>${track.title}</h1><p>${track.description}</p></div>
  </section>
  <div class="guide-layout">
    <section aria-labelledby="lessons-heading"><div class="section-heading guide-heading"><div><h2 id="lessons-heading">Уроки</h2><p>${icon('clock')} ${track.time}</p></div><div class="overview-progress" id="track-progress" data-track="${track.id}"><span>${count} из ${track.lessons.length} шагов</span>${progressMarkup(count, track.lessons.length)}</div></div>
      <div class="lessons">${track.lessons.map((lesson, index) => renderLesson(lesson, index, firstOpen.id === lesson.id)).join('')}</div>
    </section>
    ${track.features.length ? `<aside class="feature-panel" aria-labelledby="features-heading"><h2 id="features-heading">Что умеет ${track.name}</h2><div class="feature-list">${track.features.map(([name, description, href]) => `<a href="${href}" target="_blank" rel="noopener noreferrer"><span><strong>${name}</strong><small>${description}</small></span>${icon('external')}</a>`).join('')}</div></aside>` : ''}
  </div>`;
}

function renderLesson(lesson, index, open) {
  const done = completed.has(lesson.id);
  const action = lesson.action ? `<a class="button secondary" href="${lesson.action[1]}" ${lesson.action[2] === 'download' ? 'download' : ''}>${icon(lesson.action[2] === 'download' ? 'download' : 'flask')} ${lesson.action[0]}</a>` : '';
  return `<details class="lesson" id="lesson-${lesson.id}" ${open ? 'open' : ''}>
    <summary><span class="lesson-number ${done ? 'completed' : ''}" data-lesson-icon="${lesson.id}" aria-label="${done ? 'Выполнен' : 'Шаг ' + (index + 1)}" data-number="${index + 1}">${done ? icon('check') : index + 1}</span><strong>${lesson.title}</strong>${icon('chevron-down')}</summary>
    <div class="lesson-body"><p>${lesson.intro}</p><ol class="lesson-steps">${lesson.steps.map(step => `<li>${escapeHtml(step)}</li>`).join('')}</ol>
      ${lesson.code ? codeBlock(...lesson.code) : ''}
      <div class="task-note">${icon('target')}<div><strong>Задание</strong><p>${escapeHtml(lesson.task)}</p></div></div>
      <div class="actions lesson-links">${action}${externalLink(...lesson.docs)}</div>
      <button class="button completion-button ${done ? 'is-done' : ''}" type="button" data-complete="${lesson.id}" aria-pressed="${done}">${icon('check')} <span>${done ? 'Шаг выполнен' : 'Отметить выполненным'}</span></button>
    </div>
  </details>`;
}

function renderLab(detail) {
  const tab = labs.find(item => item.id === detail)?.id ?? 'api';
  const panels = { api: renderApi, sql: renderSql, supabase: renderSupabase };
  return `<section class="page-heading"><span class="track-icon purple">${icon('flask')}</span><div><h1>Лаборатория</h1><p>Отправляй HTTP-запросы, выполняй SQL и проверяй соединение с базой.</p></div></section>
    <nav class="tabs" aria-label="Разделы лаборатории">${labs.map(item => `<a class="tab ${item.id === tab ? 'selected' : ''}" href="#lab/${item.id}" ${item.id === tab ? 'aria-current="page"' : ''}>${icon(item.icon)} ${item.name}</a>`).join('')}</nav>
    ${panels[tab]()}`;
}

function renderApi() {
  return `<section class="lab-panel" aria-labelledby="api-heading"><div class="panel-intro"><h2 id="api-heading">HTTP-запрос к серверу</h2><p>Сравни ответы сервера на разные методы. Открой Network в DevTools, чтобы увидеть заголовки запроса.</p></div>
    <form class="request-form" data-request="api"><label class="field">Метод<select name="method"><option>GET</option><option>POST</option></select></label><div class="field route-field">Маршрут<code>/api/health</code></div><button class="button primary" type="submit">${icon('play')} Отправить запрос</button></form>
    <div class="results" data-results><div class="empty-result">${icon('terminal')} Ответ сервера появится здесь.</div></div>
  </section>`;
}

function renderSql() {
  return `<section class="lab-panel" aria-labelledby="sql-heading"><div class="panel-intro"><h2 id="sql-heading">SQL на учебных данных</h2><p>Запрос выполняется в SQLite на сервере. Поле <code>done</code> содержит 1 для завершённой темы и 0 для незавершённой.</p></div>
    <form class="request-form sql-form" data-request="sql"><label class="field">Пример запроса<select name="query" data-query>${Object.entries(queries).map(([id, query]) => `<option value="${id}">${query.label}</option>`).join('')}</select></label><label class="field" data-platform hidden>Платформа<select name="platform" disabled><option>Supabase</option><option>Vercel</option></select></label><button class="button primary" type="submit">${icon('play')} Выполнить запрос</button></form>
    <div data-query-code>${codeBlock('SQLite', queries.select.sql)}</div><p class="field-description" data-query-description>${queries.select.description}</p>
    <div class="results" data-results><div class="empty-result">${icon('database')} Результат запроса появится здесь.</div></div>
  </section>`;
}

function renderSupabase() {
  return `<section class="lab-panel" aria-labelledby="database-heading"><div class="panel-intro"><h2 id="database-heading">Проверка подключения</h2><p>Сервер выполнит запрос к таблице <code>practice_topics</code> в твоём проекте Supabase и покажет полученные строки.</p></div>
    <div class="task-note connection-note">${icon('plug')}<div><strong>Подготовь проект</strong><p>Укажи <code>SUPABASE_URL</code> и <code>SUPABASE_PUBLISHABLE_KEY</code> в <code>.env.local</code> или в настройках Vercel. Создай учебную таблицу по инструкции.</p><div class="actions"><a class="text-link" href="#supabase/connect">Короткий гайд</a><a class="text-link" href="/practice-topics.sql" download>Скачать SQL ${icon('download')}</a></div></div></div>
    <form class="request-form" data-request="supabase"><div class="field route-field">Маршрут<code>/api/supabase</code></div><button class="button primary" type="submit">${icon('play')} Проверить подключение</button></form>
    <div class="results" data-results><div class="empty-result">${icon('database')} Статус подключения появится здесь.</div></div>
  </section>`;
}

function renderResources(detail) {
  const filter = Object.hasOwn(filters, detail) ? detail : 'all';
  const shown = resources.filter(resource => filter === 'all' || resource.category === filter);
  return `<section class="page-heading"><span class="track-icon green">${icon('layers')}</span><div><h1>Ресурсы</h1><p>Сайты и программы для вёрстки, дизайна, отладки и изучения SQL.</p></div></section>
    <nav class="tabs resource-filters" aria-label="Категории ресурсов">${Object.entries(filters).map(([id, name]) => `<a class="tab ${id === filter ? 'selected' : ''}" href="#resources${id === 'all' ? '' : `/${id}`}" ${id === filter ? 'aria-current="page"' : ''}>${name}</a>`).join('')}</nav>
    <div class="resource-grid">${shown.map(resource => `<a class="resource-card" href="${resource.url}" target="_blank" rel="noopener noreferrer"><div class="resource-top"><span class="track-icon ${resource.color}">${icon(resource.icon)}</span><span class="resource-tag">${resource.tag}</span></div><h2>${resource.name} ${icon('external')}</h2><p>${resource.text}</p></a>`).join('')}</div>`;
}

function updateProgress() {
  const total = allLessons.length;
  document.querySelector('#side-progress').innerHTML = `${progressMarkup(completed.size, total)}<div class="side-progress-meta"><span>${completed.size} из ${total} шагов</span><span>${Math.round(completed.size / total * 100)}%</span></div>`;
  const trackProgress = document.querySelector('#track-progress');
  if (!trackProgress) return;
  const { lessons } = tracks.find(track => track.id === trackProgress.dataset.track);
  const done = lessons.filter(lesson => completed.has(lesson.id)).length;
  trackProgress.innerHTML = `<span>${done} из ${lessons.length} шагов</span>${progressMarkup(done, lessons.length)}`;
}

function renderPage({ focus = false } = {}) {
  const [page, detail] = location.hash.slice(1).split('/');
  const current = Object.hasOwn(pageLabels, page) ? page : 'home';
  const track = tracks.find(item => item.id === current);
  if (track) main.innerHTML = renderTrack(track, detail);
  else if (current === 'lab') main.innerHTML = renderLab(detail);
  else if (current === 'resources') main.innerHTML = renderResources(detail);
  else main.innerHTML = renderHome();

  document.querySelector('#breadcrumb-current').textContent = pageLabels[current];
  document.title = current === 'home' ? 'DevПрактика — веб-разработка на практике' : `${pageLabels[current]} · DevПрактика`;
  for (const link of document.querySelectorAll('[data-nav]')) {
    if (link.dataset.nav === current) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
  updateProgress();
  closeMenu(false);
  if (focus) {
    main.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
}

function tableMarkup(columns, rows) {
  if (!rows.length) return '<p class="field-description">В результате нет строк.</p>';
  const table = `<div class="result-table-wrap" tabindex="0" aria-label="Результат запроса"><table><thead><tr>${columns.map(column => `<th scope="col">${escapeHtml(column)}</th>`).join('')}</tr></thead>
    <tbody>${rows.map(row => `<tr>${columns.map(column => `<td>${escapeHtml(row[column] ?? 'NULL')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  return `<p class="result-count">Строк в ответе: ${rows.length}</p>${table}`;
}

async function runRequest(form) {
  const panel = form.closest('.lab-panel');
  const results = panel.querySelector('[data-results]');
  const data = new FormData(form);
  const request = form.dataset.request;
  const controls = [...form.querySelectorAll('select:enabled, button[type="submit"]')];
  let path = '/api/health';
  if (request === 'sql') path = `/api/sql?${new URLSearchParams(data)}`;
  if (request === 'supabase') path = '/api/supabase';

  for (const control of controls) control.disabled = true;
  results.innerHTML = '<p class="result-status" role="status">Запрос выполняется…</p>';
  const started = performance.now();
  try {
    const response = await fetch(path, { method: data.get('method') ?? 'GET', signal: AbortSignal.timeout(10000) });
    const payload = await response.json();
    const status = `<div class="result-status" role="status"><span class="status-badge ${response.ok ? 'success' : 'warning'}">HTTP ${response.status}</span><span>${Math.round(performance.now() - started)} мс</span>${payload.upstreamStatus ? `<span>Supabase: ${payload.upstreamStatus}</span>` : ''}</div>`;
    let output;
    if (request === 'api') output = codeBlock('JSON', JSON.stringify(payload, null, 2));
    else if (request === 'sql' && response.ok) output = tableMarkup(payload.columns, payload.rows);
    else if (request === 'supabase' && response.ok) output = `<p class="result-message">${escapeHtml(payload.message)}</p>${tableMarkup(['id', 'title', 'platform', 'done'], payload.rows)}`;
    else output = `<p class="result-message">${escapeHtml(payload.message)}</p>`;
    results.innerHTML = status + output;
  } catch {
    results.innerHTML = '<p class="result-message" role="status">Сервер не вернул JSON. Проверь, что проект запущен через Node.js или опубликован на Vercel с функциями API.</p>';
  } finally {
    for (const control of controls) control.disabled = false;
  }
}

const searchIndex = [
  ...tracks.flatMap(track => [
    { label: track.title, category: 'Раздел', icon: track.icon, href: `#${track.id}`, keywords: `${track.name} ${track.description}` },
    ...track.lessons.map(lesson => ({ label: lesson.title, category: track.name, icon: 'book', href: `#${track.id}/${lesson.id}`, keywords: lesson.intro })),
    ...track.features.map(([label, keywords, href]) => ({ label, category: track.name, icon: track.icon, href, keywords, external: true })),
  ]),
  ...labs.map(lab => ({ label: lab.name, category: 'Лаборатория', icon: lab.icon, href: `#lab/${lab.id}`, keywords: 'запрос тест проверка' })),
  ...resources.map(resource => ({ label: resource.name, category: resource.tag, icon: resource.icon, href: resource.url, keywords: resource.text, external: true })),
];

function updateSearch() {
  const terms = searchInput.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const matches = terms.length ? searchIndex.filter(item => {
    const text = `${item.label} ${item.category} ${item.keywords}`.toLowerCase();
    return terms.every(term => text.includes(term));
  }) : searchIndex.filter(item => !item.external).slice(0, 7);

  document.querySelector('#search-count').textContent = terms.length ? `Найдено: ${matches.length}` : '';
  document.querySelector('#search-results').innerHTML = matches.length ? matches.map(item =>
    `<a class="search-result" href="${item.href}" ${item.external ? 'target="_blank" rel="noopener noreferrer"' : ''}><span class="mini-icon green">${icon(item.icon)}</span><span><strong>${escapeHtml(item.label)}</strong><small>${escapeHtml(item.category)}</small></span>${item.external ? icon('external') : ''}</a>`).join('') : '<p class="field-description search-empty">Ничего не найдено. Попробуй название темы или сервиса.</p>';
}

function openSearch() {
  if (dialog.open) return;
  searchInput.value = '';
  updateSearch();
  dialog.showModal();
  searchInput.focus();
}

function closeMenu(restoreFocus = true) {
  if (!document.body.classList.contains('menu-open')) return;
  document.body.classList.remove('menu-open');
  menuOverlay.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  if (restoreFocus) menuButton.focus();
}

function showToast(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('visible'), 2100);
}

function toggleLesson(button) {
  const id = button.dataset.complete;
  const done = !completed.has(id);
  if (done) completed.add(id);
  else completed.delete(id);
  try {
    localStorage.setItem(progressKey, JSON.stringify([...completed]));
    showToast(done ? 'Шаг добавлен в прогресс' : 'Отметка о выполнении снята');
  } catch {
    showToast('Прогресс доступен до закрытия страницы. Браузер запретил сохранение.');
  }

  button.setAttribute('aria-pressed', done);
  button.classList.toggle('is-done', done);
  button.querySelector('span').textContent = done ? 'Шаг выполнен' : 'Отметить выполненным';
  const marker = document.querySelector(`[data-lesson-icon="${id}"]`);
  marker.classList.toggle('completed', done);
  marker.setAttribute('aria-label', done ? 'Выполнен' : `Шаг ${marker.dataset.number}`);
  marker.innerHTML = done ? icon('check') : marker.dataset.number;
  updateProgress();
}

for (const element of document.querySelectorAll('[data-icon]')) element.innerHTML = icon(element.dataset.icon);
renderPage();

window.addEventListener('hashchange', () => renderPage({ focus: true }));
matchMedia('(min-width: 841px)').addEventListener('change', () => closeMenu(false));
searchInput.addEventListener('input', updateSearch);
dialog.addEventListener('click', event => {
  if (event.target === dialog || event.target.closest('.search-result')) dialog.close();
});
document.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    openSearch();
  } else if (event.key === 'Escape' && !dialog.open) {
    closeMenu();
  }
});

document.addEventListener('click', async event => {
  if (event.target.closest('[data-skip]')) {
    event.preventDefault();
    main.focus();
    return;
  }
  if (event.target.closest('[data-search]')) openSearch();
  if (event.target.closest('[data-close-search]')) dialog.close();
  if (event.target.closest('[data-menu]')) {
    document.body.classList.add('menu-open');
    menuOverlay.hidden = false;
    menuButton.setAttribute('aria-expanded', 'true');
    document.querySelector('.close-sidebar').focus();
  }
  if (event.target.closest('[data-close-menu]')) closeMenu();
  if (event.target.closest('.sidebar a')?.hash === location.hash) closeMenu();

  const completionButton = event.target.closest('[data-complete]');
  if (completionButton) toggleLesson(completionButton);

  const copyButton = event.target.closest('[data-copy], [data-copy-value]');
  if (copyButton) {
    const value = copyButton.dataset.copyValue ?? copyButton.closest('.code-block').querySelector('code').textContent;
    try {
      await navigator.clipboard.writeText(value);
      showToast('Скопировано');
    } catch {
      showToast('Буфер обмена недоступен. Скопируй текст вручную.');
    }
  }
});

main.addEventListener('change', event => {
  if (!event.target.matches('[data-query]')) return;
  const panel = event.target.closest('.lab-panel');
  const { value } = event.target;
  const filter = panel.querySelector('[data-platform]');
  filter.hidden = value !== 'where';
  filter.querySelector('select').disabled = filter.hidden;
  panel.querySelector('[data-query-code]').innerHTML = codeBlock('SQLite', queries[value].sql);
  panel.querySelector('[data-query-description]').textContent = queries[value].description;
});

main.addEventListener('submit', event => {
  if (!event.target.matches('[data-request]')) return;
  event.preventDefault();
  runRequest(event.target);
});
