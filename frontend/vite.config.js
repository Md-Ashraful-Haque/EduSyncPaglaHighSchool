// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import fs from 'fs';

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: '0.0.0.0',
//     port: 3001,
//     https: {
//       key: fs.readFileSync('./certs/localhost-key.pem'),
//       cert: fs.readFileSync('./certs/localhost.pem'),
//     },
//     proxy: {
//       '/api': {
//         target: 'https://localhost:8013',
//         secure: false, // Ignore self-signed certificate errors
//         changeOrigin: true,
//       },
//     },
//   },
// });


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';


import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const ReactCompilerConfig = { /* ... */ };

export default defineConfig({

  
  plugins: [react(
    {
      babel: {
          plugins: [
            ["babel-plugin-react-compiler", ReactCompilerConfig],
          ],
        },
    }
  ),
],
  resolve: {
    alias: {
      // Define your aliases here
      '@': path.resolve(__dirname, './src'), // Shortcut for 'src'
      'FormFields': path.resolve(__dirname, './src/utils/formFieldsData/FormFields'), // Alias for FormFields
      'ContextAPI': path.resolve(__dirname, './src/ContextAPI'),
      'Components': path.resolve(__dirname, './src/components'),
      'LoadingComponent': path.resolve(__dirname, './src/components'),
      'Utils': path.resolve(__dirname, './src/utils'),
      'pageComponents': path.resolve(__dirname, './src/pages/00-page-components'),
      'mainSCSS': path.resolve(__dirname, './src/main-scss'),
      'schoolWebsite': path.resolve(__dirname, './src/schoolWebsite'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3002,
    https: {
      key: fs.readFileSync('/app/certs/localhost+2-key.pem'), // Updated path
      cert: fs.readFileSync('/app/certs/localhost+2.pem'),   // Updated path
    },
    proxy: {
      // '/api': 'https://ims.nexasofts.com:8013',
      // '/api': 'https://edusync.nexasofts.com',
      '/api': 'https://localhost:8017',
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: ` `,
        includePaths: ['node_modules'],
      },
    },
  },
});
