import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// Dono projects (Landing + UI) ka combined setup
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss() // Ye dashboard ki nayi Tailwind styling ke liye zaroori hai
  ],
  // Agar future mein paths ki error aaye toh yahan resolve alias add karenge
})