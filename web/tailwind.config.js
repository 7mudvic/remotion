/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand identity (matches the Remotion video)
        brand: {
          blue: '#1e3fa3',
          blueHi: '#2f55c4',
          blueLo: '#0c1f5a',
          blueDeep: '#091236',
          yellow: '#f5c233',
          yellowHi: '#ffd76b',
          yellowLo: '#a87b14',
          cream: '#fff8e3',
          ink: '#0a1638',
        },
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        tajawal: ['Tajawal', 'sans-serif'],
      },
      boxShadow: {
        chip: '0 12px 22px rgba(9, 18, 54, 0.45)',
        card: '0 24px 48px rgba(9, 18, 54, 0.30)',
        cardHi: '0 36px 70px rgba(9, 18, 54, 0.50)',
      },
      animation: {
        'spin-slow': 'spin 60s linear infinite',
      },
    },
  },
  plugins: [],
};
