import { json, methodNotAllowed } from '../lib/http.mjs';

export default {
  fetch(request) {
    if (request.method !== 'GET') return methodNotAllowed();

    return json({
      ok: true,
      environment: process.env.VERCEL_ENV || 'local',
      runtime: `Node.js ${process.versions.node}`,
      timestamp: new Date().toISOString(),
    });
  },
};
