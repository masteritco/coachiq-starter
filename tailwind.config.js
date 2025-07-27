/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      dropShadow: {
        '3xl': '0 35px 35px rgba(0, 0, 0, 0.25)',
        '4xl': [
          '0 35px 35px rgba(0, 0, 0, 0.25)',
          '0 45px 65px rgba(0, 0, 0, 0.15)'
        ]
      }
    },
  },
  plugins: [],
  safelist: [
    // Ensure these classes are never purged
    'bg-gradient-to-br',
    'from-indigo-500',
    'via-purple-600', 
    'to-pink-600',
    'text-white',
    'drop-shadow-lg',
    'shadow-xl',
    'shadow-2xl',
    'rounded-3xl',
    'rounded-2xl',
    'backdrop-blur-md',
    'backdrop-blur-xl',
    'animate-pulse',
    'animate-bounce',
    'animate-spin',
    'transform',
    'hover:scale-105',
    'bg-white/10',
    'bg-white/20',
    'bg-white/90',
    'border-white/20',
    'border-white/30'
  ]
};