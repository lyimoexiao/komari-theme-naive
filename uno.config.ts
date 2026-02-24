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
  ],
  shortcuts: {
    'flex-center': 'flex items-center justify-center',
    'flex-between': 'flex items-center justify-between',
    'flex-col-center': 'flex flex-col items-center justify-center',
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
