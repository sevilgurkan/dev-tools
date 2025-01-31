import {defineConfig} from 'tsup';

export default defineConfig([
  {
    entry: ['scripts/setup.ts'],
    format: ['esm'],
    outDir: 'bin',
    platform: 'node',
    dts: true,
    clean: true,
    banner: {
      js: '#!/usr/bin/env node',
    },
  },
]);
