export function json(data, status = 200, headers = {}) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store', ...headers } });
}

export function methodNotAllowed() {
  return json({ ok: false, message: 'Этот маршрут принимает запросы GET.' }, 405, { Allow: 'GET' });
}
