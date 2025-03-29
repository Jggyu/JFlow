/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./public/index.html"
    ],
    theme: {
      extend: {
        colors: {
          jflow: {
            purple: '#9154F7',
            indigo: '#4D73FF',
            light: '#d8c4fc',
            dark: '#0b0c23'
          }
        },
        animation: {
          'float': 'float 3s ease-in-out infinite',
          'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        },
        keyframes: {
          float: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-10px)' },
          }
        }
      },
    },
    plugins: [],
  }