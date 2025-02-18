import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        home: path.resolve(__dirname, 'home.html'),
        // Add more pages here
      },
    },
  },
  define:{
    'process.env.PROJECT_ID': JSON.stringify(process.env.PROJECT_ID),
    'process.env.DATABASE_ID': JSON.stringify(process.env.DATABASE_ID)


  }
});