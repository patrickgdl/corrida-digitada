/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"SF Mono"', 'SFMono-Regular', 'ui-monospace', '"DejaVu Sans Mono"', 'Menlo', 'Consolas', 'monospace'],
      },
      colors: {
        blue: {
          400: 'rgb(96 165 250)',
          500: 'rgb(59 130 246)',
          600: 'rgb(37 99 235)',
          700: 'rgb(29 78 216)',
        },
        slate: {
          100: 'rgb(241 245 249)',
          300: 'rgb(203 213 225)',
          400: 'rgb(148 163 184)',
          700: 'rgb(51 65 85)',
          800: 'rgb(30 41 59)',
          900: 'rgb(15 23 42)',
        },
      },
      borderRadius: {
        DEFAULT: '0.375rem',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
