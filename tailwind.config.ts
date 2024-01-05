import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      white: '#FFFFFF',
      black: '#191919',
      'secondary-black': '#46423D',
      'tertiary-black': '#6D6963',
      'primary-tan': '#E7E1D9',
      'secondary-tan': '#FBF7EC',
      'tertiary-tan': '#FFFEFA',
      'primary-blue': '#0C54A8',
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        titan: ['var(--font-titan-one)'],
        rounded: ['SF Pro Rounded', 'sans-serif'],
        sourceSerif: ['var(--font-source-serif-4)'],
        rosario: ['var(--font-rosario)'],
      },
    },
  },
  plugins: [],
};
export default config;
