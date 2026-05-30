import { defineConfig } from 'vitest/config';
import dotenv from 'dotenv';

dotenv.config({
  path: '.env',
});

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    setupFiles: ['tests/setup.ts'],
  },
  resolve: {
    alias: {
      '#': new URL('./src', import.meta.url).pathname,
    },
  },
});