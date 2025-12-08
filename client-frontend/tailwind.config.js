/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // You can define your custom colors here
        primary: {
          50: '#eff6ff',
          500: '#1a73e8',
          600: '#1a73e8',
        },
      },
    },
  },
  plugins: [],
}