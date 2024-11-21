/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  safelist: [
    {
      pattern: /(bg|text)-(yellow|emerald|indigo)-(100|400|700|900)/,
    },
  ],
  plugins: [],
};