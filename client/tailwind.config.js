/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          lavender: '#b794f4',
          'lavender-dark': '#6d4ca6',
          pink: '#fbb6ce',
          'pink-dark': '#844e63',
          custard: '#fefcbf',
          canvas: '#fffbf5',
          paper: '#fdf9f3',
          surface: '#f3e8ff',
          text: '#4a4458',
        }
      },
      fontFamily: {
        headline: ['Epilogue', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif']
      },
      boxShadow: {
        'scrapbook': '0 8px 24px -4px rgba(183, 148, 244, 0.22), 0 2px 6px rgba(74, 68, 88, 0.05)',
        'squish': '0 4px 0px #8b5cf6',
        'squish-pink': '0 4px 0px #f472b6',
        'sticker': '0 4px 10px rgba(183, 148, 244, 0.25)',
      }
    },
  },
  plugins: [],
}
