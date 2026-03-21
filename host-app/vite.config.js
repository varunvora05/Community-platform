import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

// In dev mode remoteEntry.js is served at /remoteEntry.js.
// After build+preview it is served at /assets/remoteEntry.js.
// Pass VITE_PREVIEW=true to use the preview paths (see README).
const usePreviewPaths = process.env.VITE_PREVIEW === 'true';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'host',
      remotes: {
        auth_frontend: usePreviewPaths
          ? 'http://localhost:3001/assets/remoteEntry.js'
          : 'http://localhost:3001/remoteEntry.js',
        community_frontend: usePreviewPaths
          ? 'http://localhost:3002/assets/remoteEntry.js'
          : 'http://localhost:3002/remoteEntry.js'
      },
      shared: {
        react: { singleton: true, eager: true, requiredVersion: '^18.2.0' },
        'react-dom': { singleton: true, eager: true, requiredVersion: '^18.2.0' },
        '@apollo/client': { singleton: true, requiredVersion: '^3.9.1' },
        graphql: { singleton: true, requiredVersion: '^16.8.1' }
      }
    })
  ],
  server: {
    port: 3000
  },
  preview: {
    port: 3000
  },
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
});
