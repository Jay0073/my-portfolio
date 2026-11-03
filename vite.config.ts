import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// Dev-only: run the Vercel-style handlers in api/ under `npm run dev`,
// so /admin login, draft save, and publish work locally without Vercel.
function localApiPlugin(): Plugin {
  return {
    name: 'local-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) return next();
        try {
          const url = new URL(req.url, 'http://localhost');
          const modulePath = `${url.pathname}.ts`;

          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);
          const raw = Buffer.concat(chunks).toString('utf8');
          let body: unknown;
          if (raw) {
            try {
              body = JSON.parse(raw);
            } catch {
              body = raw;
            }
          }

          const query: Record<string, string | string[]> = {};
          for (const [key, value] of url.searchParams) {
            const prev = query[key];
            query[key] =
              prev === undefined
                ? value
                : Array.isArray(prev)
                  ? [...prev, value]
                  : [prev, value];
          }

          let statusCode = 200;
          const apiRes = {
            status(code: number) {
              statusCode = code;
              return apiRes;
            },
            setHeader(name: string, value: string) {
              res.setHeader(name, value);
              return apiRes;
            },
            json(payload: unknown) {
              res.statusCode = statusCode;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(payload ?? null));
              return apiRes;
            },
            end(payload?: string) {
              res.statusCode = statusCode;
              res.end(payload);
              return apiRes;
            },
          };

          const apiReq = {
            method: req.method,
            headers: req.headers,
            query,
            body,
            socket: req.socket,
            url: req.url,
          };

          const mod = await server.ssrLoadModule(modulePath);
          await mod.default(apiReq, apiRes);
          if (!res.writableEnded) {
            res.statusCode = statusCode;
            res.end();
          }
        } catch (err) {
          console.error('[local-api]', err);
          if (!res.writableEnded) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Local API error' }));
          }
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Make server-only secrets from .env.local visible to the API handlers.
  const env = loadEnv(mode, process.cwd(), '');
  for (const key of [
    'ADMIN_PASSWORD',
    'SESSION_SECRET',
    'KV_REST_API_URL',
    'KV_REST_API_TOKEN',
    'BLOB_READ_WRITE_TOKEN',
  ]) {
    if (env[key] && !process.env[key]) process.env[key] = env[key];
  }

  return {
    base: '/',
    plugins: [react(), localApiPlugin()],
    build: {
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-helmet-async'],
            animations: ['gsap', '@lottiefiles/dotlottie-react', 'lenis'],
            ui: ['lucide-react', 'react-icons', 'tippy.js'],
          },
        },
      },
    },
  };
});
