/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        tactical: {
          bg: '#070b12',
          surface: '#0d1522',
          card: '#121d2f',
          cardHover: '#18263d',
          border: '#1f334d',
          borderLight: '#2c486d',
          primary: '#00e5a3', // tactical emerald green / cyan
          primaryDark: '#00b37e',
          accent: '#00c3ff', // electric teal/cyan
          radar: '#10f089',
          amber: '#f59e0b',
          amberDark: '#d97706',
          critical: '#ef4444',
          criticalGlow: '#ff2d55',
          textMuted: '#829bb5',
          textNormal: '#c5d8ea',
          textBright: '#f1f7fc',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-green': '0 0 15px rgba(0, 229, 163, 0.35)',
        'glow-teal': '0 0 15px rgba(0, 195, 255, 0.35)',
        'glow-red': '0 0 15px rgba(239, 68, 68, 0.45)',
        'glow-amber': '0 0 15px rgba(245, 158, 11, 0.45)',
      },
      animation: {
        'radar-sweep': 'sweep 4s linear infinite',
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        sweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
