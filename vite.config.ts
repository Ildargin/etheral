/// <reference types="vitest/config" />
import * as path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Config for global end-to-end tests
 * placed in project root tests folder
 * @type {import('vite').UserConfig}
 * @see https://vitest.dev/config/
 */
export default defineConfig({
  mode: process.env.MODE,
  plugins: [react()],
  define: {
    global: {},
  },
  base: '/',
  test: {
    environment: 'happy-dom',
  },
  resolve: {
    alias: [
      { find: '@api', replacement: path.resolve(__dirname, 'src/api') },
      { find: '@components', replacement: path.resolve(__dirname, 'src/components') },
      { find: '@contexts', replacement: path.resolve(__dirname, 'src/contexts') },
      { find: '@hooks', replacement: path.resolve(__dirname, 'src/hooks') },
      { find: '@pages', replacement: path.resolve(__dirname, 'src/pages') },
      { find: '@utils', replacement: path.resolve(__dirname, 'src/utils') },
    ],
  },
})
