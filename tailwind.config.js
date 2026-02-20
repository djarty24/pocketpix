/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pocket-silver': '#D1D5DB',
        'pocket-orange': '#FF8C42',
        'cozy-cream': '#FDFBF7',
      },
    },
  },
  plugins: [],
}