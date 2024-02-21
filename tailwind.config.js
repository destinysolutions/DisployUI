/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@apideck/file-picker/dist/*.js",
  ],
  darkMode: ['variant', [
    '@media (prefers-color-scheme: dark) { &:not(.light *) }',
    '&:is(.dark *)',
  ]],
  theme: {
    extend: {
      colors: {
        primary: "#000",
        secondary: "#fff",
        black: "#000",
        gray: "#ccc",
        white: "#fff",
        SlateBlue: "#e4aa07",
        red: "#e16969",
        green: "#039F41",
        lightgray: "#ebebeb",
      },
    },
    screens: {
      xs: "200px",
      // => @media (min-width: 280px) { ... }

      sm: "400px",
      // => @media (min-width: 400px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }
      xl: "1280px",
    },
  },
  plugins: [],
};
