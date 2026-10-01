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
        term: {
          bg: '#070a0e',
          panel: '#0d1117',
          panelHeader: '#121820',
          panelBorder: '#1c2433',
          card: '#0f141c',
          cardHover: '#151d28',
          text: '#c9d1d9',
          muted: '#8b949e',
          darkMuted: '#484f58',
          green: '#00ff66',
          greenDim: '#00cc52',
          greenGlow: 'rgba(0, 255, 102, 0.15)',
          cyan: '#00f0ff',
          cyanDim: '#00b8c4',
          cyanGlow: 'rgba(0, 240, 255, 0.15)',
          purple: '#b537f2',
          purpleDim: '#8b24bd',
          purpleGlow: 'rgba(181, 55, 242, 0.15)',
          amber: '#ffaa00',
          amberDim: '#cc8800',
          amberGlow: 'rgba(255, 170, 0, 0.15)',
          red: '#ff3366',
          redDim: '#cc224e',
          redGlow: 'rgba(255, 51, 102, 0.15)',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-green': '0 0 15px rgba(0, 255, 102, 0.3)',
        'glow-cyan': '0 0 15px rgba(0, 240, 255, 0.3)',
        'glow-purple': '0 0 15px rgba(181, 55, 242, 0.3)',
        'glow-amber': '0 0 15px rgba(255, 170, 0, 0.3)',
        'panel': '0 4px 20px rgba(0, 0, 0, 0.6)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'cursor-blink': 'blink 1s step-start infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        }
      }
    },
  },
  plugins: [],
};
