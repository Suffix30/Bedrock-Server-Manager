/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00D1FF',
        'bg-dark': '#0F172A',
        'bg-card': '#1E293B',
      },
    },
  },
  plugins: [],
}