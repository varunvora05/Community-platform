import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'communityFrontend',
      filename: 'remoteEntry.js',
      exposes: {
        './CommunityApp': './src/CommunityApp.jsx',
      },
      shared: {
        react: { singleton: true, requiredVersion: false },
        'react-dom': { singleton: true, requiredVersion: false },
      },
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
  },
  server: { port: 5002 },
  preview: { port: 5002 },
});