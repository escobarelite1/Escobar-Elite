import { defineConfig } from 'vite';

const rawPort = process.env.PORT;
const basePath = process.env.BASE_PATH;

if (!rawPort || !basePath) {
  throw new Error('PORT and BASE_PATH environment variables are required.');
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

export default defineConfig({
  base: basePath,
  root: import.meta.dirname,
  build: {
    outDir: 'dist/public',
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    fs: { strict: true },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});