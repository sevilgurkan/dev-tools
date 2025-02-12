import {defineConfig} from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    outDir: 'dist',
    platform: 'node',
    dts: true,
    clean: true,
  },
]);
