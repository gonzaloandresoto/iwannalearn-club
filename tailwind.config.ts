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
      'primary-grey': '#7B7B7B',
      'secondary-grey': '#E3E3E3',
      'tertiary-grey': '#F6F6F6',
      'primary-blue': '#3662FD',
      'secondary-blue': '#3662FD',
      'primary-orange': '#FE8312',
      'secondary-orange': '#FE8312',
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
      },
    },
  },
  plugins: [],
};
export default config;
