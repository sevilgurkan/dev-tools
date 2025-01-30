import {defineConfig} from 'tsup';

export default defineConfig([
  // CLI build yapılandırması
  {
    entry: ['scripts/setup.ts'],
    format: ['esm'],
    outDir: 'bin',
    platform: 'node',
    clean: true,
    minify: true,
    treeshake: true,
    splitting: true,
    banner: {
      js: '#!/usr/bin/env node',
    },
  },
]);
