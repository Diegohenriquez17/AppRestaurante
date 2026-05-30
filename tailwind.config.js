/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Terracota principal (calido, restaurante)
        brand: {
          50: '#fbf2ea',
          100: '#f5e0cc',
          200: '#ecc8a8',
          300: '#dd9d6f',
          400: '#cf7355',
          500: '#c2553d',
          600: '#9a3f2c',
          700: '#7d3122',
          900: '#2a221c',
        },
        // Fondos crema / superficies
        cream: {
          DEFAULT: '#faf6f0',
          100: '#f5efe5',
          200: '#e8ddd0',
          300: '#dccbb6',
        },
        // Tinta (texto)
        ink: {
          DEFAULT: '#2a221c',
          muted: '#8a7d70',
        },
        // Acento dorado / mostaza
        gold: {
          300: '#e6b465',
          400: '#d99641',
          500: '#c4831f',
          600: '#b87b1f',
        },
        // Estados
        sauce: '#a8323f', // danger calido
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['Inter', 'Segoe UI Variable Text', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 45px rgba(42, 34, 28, 0.10)',
        warm: '0 10px 28px rgba(42, 34, 28, 0.10)',
        glow: '0 8px 24px rgba(194, 85, 61, 0.25)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
