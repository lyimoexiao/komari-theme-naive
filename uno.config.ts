import presetWind4 from '@unocss/preset-wind4'
import { defineConfig, presetIcons, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
  presets: [
    presetWind4(),
    presetIcons({
      scale: 1.2,
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  theme: {
    colors: {
      primary: 'var(--primary-color)',
      secondary: 'var(--secondary-color)',
    },
  },
  rules: [
    [
      'font-tcloud-number',
      {
        'font-family': '"TCloud Number VF", system-ui, sans-serif',
      },
    ],
    // 毛玻璃效果 - 动态模糊半径
    [
      /^glass-(\d+)$/,
      ([, d]) => ({
        'backdrop-filter': `blur(${d}px)`,
        '-webkit-backdrop-filter': `blur(${d}px)`,
      }),
    ],
    // 毛玻璃效果 - 卡片背景色（使用 CSS 变量）
    [
      /^glass-bg$/,
      () => ({
        'background-color': 'color-mix(in srgb, var(--n-color) 75%, transparent)',
      }),
    ],
    // 毛玻璃效果 - 暗色模式卡片背景
    [
      /^glass-bg-dark$/,
      () => ({
        'background-color': 'color-mix(in srgb, var(--n-color) 80%, transparent)',
      }),
    ],
  ],
  shortcuts: {
    'flex-center': 'flex items-center justify-center',
    'flex-between': 'flex items-center justify-between',
    'flex-col-center': 'flex flex-col items-center justify-center',
    // 毛玻璃卡片效果组合
    'glass-card': 'glass-12 glass-bg dark:glass-bg-dark',
    'glass-card-sm': 'glass-8 glass-bg dark:glass-bg-dark',
    'glass-card-lg': 'glass-16 glass-bg dark:glass-bg-dark',
  },
  preflights: [
    {
      layer: 'base',
      getCSS: () => `
@font-face {
  font-family: 'TCloud Number VF';
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url('/fonts/TCloudNumberVF.ttf') format('truetype');
}
      `,
    },
  ],
})
