/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F7F8FA',
        surface: '#FFFFFF',
        line: '#E5E7EB',
        ink: '#1F2933',
        sub: '#6B7280',
        ai: '#6366F1',
        ok: '#10B981',
        warn: '#F59E0B',
        danger: '#EF4444',
        idle: '#9CA3AF',
      },
      fontFamily: {
        sans: ['"Inter"', '"PingFang SC"', '"Microsoft YaHei"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        '13': '13px',
      },
    },
  },
  plugins: [],
}
