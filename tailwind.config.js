/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5298AA',
          50: '#CDE1E7',
          100: '#BFD9E0',
          200: '#A4C9D3',
          300: '#88B9C6',
          400: '#6CA9B8',
          500: '#5298AA',
          600: '#407684',
          700: '#2D545E',
          800: '#1B3238',
          900: '#091113',
        },
        accent: {
          DEFAULT: '#F2843A',
          50: '#FDF0E6',
          100: '#FCE4D3',
          200: '#FACCAD',
          300: '#F7B487',
          400: '#F59C60',
          500: '#F2843A',
          600: '#E5650F',
          700: '#B04E0C',
          800: '#7C3708',
          900: '#471F05',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
