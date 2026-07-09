/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        sena: {
          primary: '#6366F1',
          secondary: '#8B5CF6',
          accent: '#EC4899',
          surface: '#F8FAFC',
          'surface-dark': '#0F172A',
          muted: '#64748B',
        },
      },
    },
  },
  plugins: [],
};
