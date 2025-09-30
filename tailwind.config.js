/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#E5E5E5',
          secondary: '#FBFBFB',
          background: '#171717',
        },
      },
    },
  },
  plugins: [],
}
