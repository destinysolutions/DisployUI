/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      primary: '#00072E',
      secondary: '#fff',
      black: '#000',
      gray: '#ccc',
      white: '#fff',
      SlateBlue: '#41479B',
      red: '#e16969'
    },
    screens: {
      'xs': '200px',
      // => @media (min-width: 280px) { ... }

      'sm': '400px',
      // => @media (min-width: 400px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }


    }
  },
  plugins: [],
}

