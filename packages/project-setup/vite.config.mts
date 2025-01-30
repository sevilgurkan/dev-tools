import {defineConfig} from 'vitest/config';

import packageJson from './package.json';

export default defineConfig({
  test: {
    name: packageJson.name,
    dir: './src',
    watch: false,
    environment: 'node',
    typecheck: {enabled: true},
    restoreMocks: true,
    testTimeout: 50000,
  },
});
