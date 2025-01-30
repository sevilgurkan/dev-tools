import {defineConfig} from 'tsup';

export default defineConfig([
  {
    entry: ['scripts/setup.ts'],
    format: ['cjs', 'esm'],
    outDir: 'bin',
    platform: 'node',
    dts: true,
    clean: true,
    banner: {
      js: '#!/usr/bin/env node',
    },
  },
]);
