import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
<<<<<<< HEAD
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
=======
      name: 'community_frontend',
      filename: 'remoteEntry.js',
      exposes: {
        './CommunityApp': './src/App.jsx'
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
    port: 3002
  },
  preview: {
    port: 3002
  },
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
});
>>>>>>> ff81d9ceeb2b33a29fbbae8dcd627f3ca2523e3b
