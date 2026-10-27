import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    dts({
      entryRoot: 'src',
      include: ['src/**/*'],
      outDirs: 'dist',
    }),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}.js`,
    },
    sourcemap: true,
    rollupOptions: {
      external: [
        /^node:/,
        'fs',
        'crypto',
        'axios',
        'form-data',
        '@bufbuild/protobuf',
        'plugnmeet-protocol-js',
      ],
    },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    globals: false,
  },
});
