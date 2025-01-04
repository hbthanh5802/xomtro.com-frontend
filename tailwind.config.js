/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // backgroundColor: '#F2F4F7',
        backgroundColor: '#F5F5FA',
        primaryColor: '#0B6BCB',
      },
      fontFamily: {
        writing: ['Pacifico', 'sans-serif', 'monospace'],
      },
      keyframes: {
        slidein: {
          from: {
            opacity: '0',
            transform: 'translateY(-10px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      animation: {
        slidein: 'slidein 1s ease var(--slidein-delay, 0) forwards',
      },
    },
    screens: {
      tablet: '640px',
      // => @media (min-width: 640px) { ... }
      tabletMd: '768px', // @media (min-width: 768px)
      tabletLg: '896px', // @media (min-width: 896px)
      laptop: '1024px',
      // => @media (min-width: 1024px) { ... }
      desktop: '1280px',
    },
  },
  plugins: [require('tailwindcss-animated'), require('tailwind-scrollbar')],
  prefix: 'tw-',
};
