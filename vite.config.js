import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/AprilTagTesting/",
  build: {
    outDir: 'dist', // Ensure correct output directory
    assetsDir: 'assets', // Correct asset directory
  }
})