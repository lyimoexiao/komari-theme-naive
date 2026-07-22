import antfu from '@antfu/eslint-config'

export default antfu({
  type: 'app',
  ignores: [
    '**/dist/**',
    'auto-imports.d.ts',
    'components.d.ts',
    'komari-theme-naive-build-*.zip',
  ],
  typescript: true,
  unocss: true,
  vue: true,
  formatters: {
    css: true,
    html: true,
    markdown: true,
  },
})
