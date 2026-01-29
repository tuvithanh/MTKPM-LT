/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Dòng này đảm bảo quét toàn bộ file trong src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
