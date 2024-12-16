/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
       colors: {
        dark: "#2C3639",
        semidark: "#3F4E4F",
        lightdark:"#A27B5C",
        light:"#DCD7C9"
      }
    },
  },
  plugins: [],
}