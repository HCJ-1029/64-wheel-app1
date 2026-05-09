/**
 * Tailwind CSS Configuration
 * @type {import('tailwindcss').Config}
 */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'wheel-red': '#E74C3C',
        'wheel-orange': '#F39C12',
        'wheel-yellow': '#F1C40F',
        'wheel-green': '#2ECC71',
        'wheel-cyan': '#1ABC9C',
        'wheel-blue': '#3498DB',
        'wheel-indigo': '#9B59B6',
        'wheel-pink': '#E91E63',
      },
    },
  },
  plugins: [],
}
