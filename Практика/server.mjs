import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import health from './api/health.mjs';
import sql from './api/sql.mjs';
import supabase from './api/supabase.mjs';
import { json } from './lib/http.mjs';

try {
  process.loadEnvFile(fileURLToPath(new URL('.env.local', import.meta.url)));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const api = new Map([
  ['/api/health', health],
  ['/api/sql', sql],
  ['/api/supabase', supabase],
]);
const assets = new Map([
  ['/index.html', 'text/html; charset=utf-8'],
  ['/styles.css', 'text/css; charset=utf-8'],
  ['/app.js', 'text/javascript; charset=utf-8'],
  ['/content.js', 'text/javascript; charset=utf-8'],
  ['/sql-examples.js', 'text/javascript; charset=utf-8'],
  ['/practice-topics.sql', 'text/plain; charset=utf-8'],
  ['/favicon.png', 'image/png'],
  ['/fonts/golos-cyrillic.woff2', 'font/woff2'],
  ['/fonts/golos-latin.woff2', 'font/woff2'],
  ['/fonts/jetbrains-cyrillic.woff2', 'font/woff2'],
  ['/fonts/jetbrains-latin.woff2', 'font/woff2'],
]);

const httpServer = createServer(async (incoming, outgoing) => {
  try {
    const url = new URL(`http://localhost${incoming.url}`);
    const method = incoming.method;
    const handler = api.get(url.pathname);
    if (handler) {
      const response = await handler.fetch(new Request(url, { method }));
      outgoing.writeHead(response.status, Object.fromEntries(response.headers));
      outgoing.end(method === 'HEAD' ? undefined : await response.text());
      return;
    }

    const path = url.pathname === '/' ? '/index.html' : url.pathname;
    const mime = assets.get(path);
    if (mime && (method === 'GET' || method === 'HEAD')) {
      const body = await readFile(new URL(`./public${path}`, import.meta.url));
      outgoing.writeHead(200, { 'Content-Type': mime, 'Cache-Control': 'no-cache' });
      outgoing.end(method === 'HEAD' ? undefined : body);
      return;
    }

    const status = mime ? 405 : 404;
    const response = json({ ok: false, message: mime ? 'Маршрут принимает GET и HEAD.' : 'Страница не найдена.' }, status);
    if (mime) response.headers.set('Allow', 'GET, HEAD');
    outgoing.writeHead(response.status, Object.fromEntries(response.headers));
    outgoing.end(method === 'HEAD' ? undefined : await response.text());
  } catch (error) {
    console.error(error.name, error.code || 'request failed');
    outgoing.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
    outgoing.end(JSON.stringify({ ok: false, message: 'Внутренняя ошибка локального сервера.' }));
  }
});

httpServer.on('error', (error) => {
  console.error(error.code === 'EADDRINUSE' ? 'Порт занят. Укажи другой порт через переменную PORT.' : error.message);
  process.exitCode = 1;
});

httpServer.listen(Number(process.env.PORT || 3000), '127.0.0.1', () => {
  console.log('✓ Сервер запущен');
  console.log(`› http://127.0.0.1:${httpServer.address().port}`);
});
