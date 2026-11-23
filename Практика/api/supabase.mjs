import { json, methodNotAllowed } from '../lib/http.mjs';

const projectUrlPattern = /^https:\/\/[a-z0-9]+\.supabase\.co\/?$/i;
const publishableKeyPattern = /^sb_publishable_[A-Za-z0-9_-]+$/;

export default {
  async fetch(request) {
    if (request.method !== 'GET') return methodNotAllowed();

    const projectUrl = process.env.SUPABASE_URL?.trim();
    const key = process.env.SUPABASE_PUBLISHABLE_KEY?.trim();
    if (!projectUrl || !key) {
      return json({ ok: false, message: 'Добавь SUPABASE_URL и SUPABASE_PUBLISHABLE_KEY и перезапусти сервер или обнови деплой.' }, 503);
    }

    if (!projectUrlPattern.test(projectUrl) || !publishableKeyPattern.test(key)) {
      return json({ ok: false, message: 'Нужны стандартный HTTPS-адрес проекта вида https://<ref>.supabase.co и ключ sb_publishable_…' }, 503);
    }

    const url = new URL('/rest/v1/practice_topics', projectUrl);
    url.search = new URLSearchParams({ select: 'id,title,platform,done', order: 'id.asc', limit: '10' });
    try {
      const response = await fetch(url, {
        headers: { apikey: key, Accept: 'application/json' },
        redirect: 'error',
        signal: AbortSignal.timeout(6000),
      });

      if (!response.ok) {
        const hints = {
          401: 'Проверь, что URL и publishable key принадлежат одному проекту.',
          403: 'Проверь, что роли anon выдан SELECT на учебную таблицу.',
          404: 'Создай practice_topics через SQL Editor и проверь, что Data API включён.',
        };
        const message = hints[response.status] || 'Проверь, что проект активен, а Data API доступен.';
        return json({ ok: false, upstreamStatus: response.status, message }, 502);
      }

      const rows = await response.json();
      if (!Array.isArray(rows)) {
        return json({ ok: false, message: 'Data API вернул неожиданный формат ответа.' }, 502);
      }

      return json({
        ok: true,
        upstreamStatus: response.status,
        rows,
        message: rows.length ? 'Соединение с Supabase работает.' : 'Соединение работает. Проверь данные таблицы и политику SELECT для anon.',
      });
    } catch {
      return json({ ok: false, message: 'Сервер не получил корректный ответ от Supabase. Проверь адрес и попробуй снова.' }, 502);
    }
  },
};
