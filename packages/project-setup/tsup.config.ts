import {defineConfig} from 'tsup';

export default defineConfig([
  // CLI build yapılandırması
  {
    entry: ['scripts/setup.ts'],
    format: ['esm'],
    outDir: 'bin',
    platform: 'node',
    clean: true,
    banner: {
      js: '#!/usr/bin/env node',
    },
  },
  // Library build yapılandırması
  {
    entry: ['scripts/setup.ts'],
    format: ['esm'],
    dts: true,
    outDir: 'dist',
    platform: 'node',
    sourcemap: true,
  },
]);
