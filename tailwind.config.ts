import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#F47B20',
          hover: '#E06A10',
          light: '#FFF3E8',
          dark: '#C55E0A',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          alt: '#F8F8FA',
          border: '#E5E7EB',
        },
        text: {
          DEFAULT: '#1A1A2E',
          secondary: '#6B7280',
          muted: '#9CA3AF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
