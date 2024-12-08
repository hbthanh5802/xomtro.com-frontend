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
        writing: 'Pacifico',
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
