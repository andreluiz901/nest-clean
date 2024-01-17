import swc from 'unplugin-swc'
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    alias: {
      '@src': './src',
      '@test': './test',
      '@/*': './src/*',
    },
    root: './',
    exclude: [...configDefaults.exclude, '**/data/pg/**'],
  },
  resolve: {
    alias: {
      '@src': './src',
      '@test': './test',
      '@/*': './src/*',
    },
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
})
