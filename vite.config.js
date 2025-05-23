import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { env } from 'node:process';
import path from 'path';


export default defineConfig(({ command, mode }) => {
  // Charger le fichier env basé sur le `mode` dans le répertoire de travail actuel.
  // Définir le troisième paramètre à '' pour charger toutes les variables d'env indépendamment du préfixe `VITE_`.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      svgr({
        svgrOptions: {
          // svgr options
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          format: 'es'
        }
      }
    },
    server: {
      proxy: {
        '/api': {
          target: 'https://mern-backend-neon.vercel.app/',
          changeOrigin: true,
          secure: false
        }
      }
    },
    define: {
        __APP_ENV__: JSON.stringify(env.APP_ENV),
        __MONGO_URI__: JSON.stringify(env.VITE_MONGO_URI),
    },
  }
});
