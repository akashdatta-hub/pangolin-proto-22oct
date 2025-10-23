import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'node:child_process'

// Get git commit SHA for build tracking
const getBuildSHA = (): string => {
  try {
    return execSync('git rev-parse HEAD').toString().trim();
  } catch {
    return 'local-dev';
  }
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Inject build SHA as a compile-time constant
    'import.meta.env.VITE_BUILD_SHA': JSON.stringify(getBuildSHA()),
  },
})
