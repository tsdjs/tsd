import {defineConfig} from 'vite'

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    exclude: ['test/fixtures/**/*'],
    testTimeout: 60000,
    maxConcurrency: 20,
    minThreads: 10,
    maxThreads: 20
  },
})
