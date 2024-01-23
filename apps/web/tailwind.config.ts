import sfTypography from '@storefront-ui/typography';
import { tailwindConfig } from '@storefront-ui/vue/tailwind-config';
import type { Config } from 'tailwindcss';

export default {
  presets: [tailwindConfig],
  content: ['./**/*.vue', '../../node_modules/@storefront-ui/vue/**/*.{js,mjs}'],
  theme: {
    extend: {
      colors: {
        'secondary': {
          '50': '#fbf8ef',
          '100': '#f3ebd2',
          '200': '#e6d4a1',
          '300': '#dabc71',
          '400': '#d1a54e',
          '500': '#c78b39',
          '600': '#b06d2f',
          '700': '#92532b',
          '800': '#784228',
          '900': '#633824',
          '950': '#381c10',
        },
        'primary': {
          '50': '#f5f6f6',
          '100': '#e4e7e9',
          '200': '#cdd3d4',
          '300': '#aab3b6',
          '400': '#7f8d91',
          '500': '#647176',
          '600': '#566064',
          '700': '#495055',
          '800': '#3e4346',
          '900': '#393d40',
          '950': '#232629',
      },
        oldprimary: {
          '50': '#ecffff',
          '100': '#cefbff',
          '200': '#a4f7fd',
          '300': '#65edfb',
          '400': '#20dbf0',
          '500': '#04bed6',
          '600': '#0697b4',
          '700': '#0c7992',
          '800': '#146276',
          '900': '#155064',
          '950': '#073342',
        },
        oldsecondary: {
          '50': '#fffde7',
          '100': '#fffcc1',
          '200': '#fff787',
          '300': '#ffea42',
          '400': '#ffd90f',
          '500': '#f1c002',
          '600': '#cf9400',
          '700': '#a56903',
          '800': '#88520b',
          '900': '#74430f',
          '950': '#442204',
        },
      },
      gridTemplateAreas: {
        'product-page': ['left-top right', 'left-bottom right'],
      },
      gridTemplateColumns: {
        'product-page': 'minmax(56%, 500px) auto',
      },
      gridTemplateRows: {
        'category-sidebar': 'min-content auto min-content',
      },
      screens: {
        '4xl': '1920px',
        '3xl': '1536px',
        '2xl': '1366px',
        xl: '1280px',
        lg: '1024px',
        md: '768px',
        sm: '640px',
        xs: '376px',
        '2xs': '360px',
      },
    },
  },
  plugins: [sfTypography, require('@savvywombat/tailwindcss-grid-areas')],
} as Config;
