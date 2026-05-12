import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        "primary-hover": "var(--primary-hover)",
        surface: "var(--surface)",
        accent: "var(--accent)",
      },
      backgroundImage: {
        'cinema-gradient': "linear-gradient(to top, rgba(15, 23, 42, 1), rgba(15, 23, 42, 0))",
      }
    },
  },
  plugins: [react(), tailwindcss(),],
  
})
