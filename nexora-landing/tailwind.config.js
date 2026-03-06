/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Ye landing aur dashboard dono ki files ko cover karega
  ],
  theme: {
    extend: {
      // Agar aapne dashboard mein koi custom colors ya fonts use kiye hain, 
      // toh unhe yahan extend mein add karna hoga.
    },
  },
  plugins: [],
}