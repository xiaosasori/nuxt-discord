/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Whitney', 'Open Sans', ...defaultTheme.fontFamily.sans],
        title: ['Ginto', 'Open Sans', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        brand: '#5865f2',
        'brand-560': '#4752C4',
        'brand-600': '#3C45A5',
        gray: {
          50: '#ECEDEE',
          100: '#DCDDDE',
          200: '#B9BBBE',
          300: '#8E9297',
          400: '#72767D',
          500: '#5C6067',
          550: '#4f545c',
          600: '#464950',
          700: '#36393F',
          800: '#2F3136',
          900: '#202225',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
