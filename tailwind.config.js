// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        delius: ['Delius', 'cursive'],
        fredericka: ['Fredericka the Great', 'serif'],
        rochester: ['Rochester', 'cursive'],
        jua: ['Jua', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],  // Default Inter font
      },
    },
  },
  plugins: [],
}
