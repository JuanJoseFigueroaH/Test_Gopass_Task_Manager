import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gopass: {
          green: {
            50: '#e6f7e6',
            100: '#c2ebc2',
            200: '#9ade9a',
            300: '#6fd16f',
            400: '#4fc74f',
            500: '#2ebd2e',
            600: '#27a827',
            700: '#1f911f',
            800: '#177a17',
            900: '#0a520a',
          },
          black: {
            50: '#e6e6e6',
            100: '#cccccc',
            200: '#999999',
            300: '#666666',
            400: '#4d4d4d',
            500: '#333333',
            600: '#262626',
            700: '#1a1a1a',
            800: '#0d0d0d',
            900: '#000000',
          },
        },
      },
    },
  },
  plugins: [],
}

export default config
