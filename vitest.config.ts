// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    exclude: ['test/playwright/**'],
    include: ['src/**/*.test.ts', 'test/**/*.test.ts'],
  },
});
 