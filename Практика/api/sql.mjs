import { DatabaseSync } from 'node:sqlite';
import { json, methodNotAllowed } from '../lib/http.mjs';
import { queries } from '../public/sql-examples.js';

const platforms = ['Vercel', 'Supabase'];

function openDemoDatabase() {
  const db = new DatabaseSync(':memory:');
  db.exec(`
    CREATE TABLE practice_topics (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      platform TEXT NOT NULL,
      done INTEGER NOT NULL
    );
    INSERT INTO practice_topics VALUES
      (1, 'Первый деплой', 'Vercel', 1),
      (2, 'Переменные окружения', 'Vercel', 0),
      (3, 'Подключение проекта', 'Supabase', 1),
      (4, 'Таблицы и RLS', 'Supabase', 0),
      (5, 'Serverless-функции', 'Vercel', 0),
      (6, 'Auth и Storage', 'Supabase', 0);
  `);
  return db;
}

export default {
  fetch(request) {
    if (request.method !== 'GET') return methodNotAllowed();

    const params = new URL(request.url).searchParams;
    const query = params.get('query') ?? 'select';
    const platform = params.get('platform') ?? 'Supabase';

    if (!Object.hasOwn(queries, query) || (query === 'where' && !platforms.includes(platform))) {
      return json({ ok: false, message: 'Выбери один из учебных запросов и допустимую платформу.' }, 400);
    }

    const db = openDemoDatabase();
    try {
      const statement = db.prepare(queries[query].sql);
      const rows = query === 'where' ? statement.all(platform) : statement.all();
      return json({ ok: true, columns: statement.columns().map(({ name }) => name), rows });
    } finally {
      db.close();
    }
  },
};
