import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // This might help with 'urdf-loader' import issues by preventing Vite from pre-bundling it.
  optimizeDeps: {
    exclude: ['urdf-loader'],
  },
});
