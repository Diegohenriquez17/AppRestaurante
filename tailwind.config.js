/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fbf2ea',
          100: '#f5e0cc',
          500: '#c2553d',
          600: '#9a3f2c',
          900: '#2a221c',
        },
      },
      boxShadow: {
        soft: '0 18px 45px rgba(42, 34, 28, 0.10)',
      },
    },
  },
  plugins: [],
}
