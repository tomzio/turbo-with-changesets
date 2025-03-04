import { defineConfig } from 'tsup';

export default defineConfig(options => {
  return {
    entry: ['src/**/*.ts?(x)'],
    format: ['esm'],
    splitting: true,
    dts: options.dts || true,
    minify: !options.watch,
    sourcemap: !!options.watch,
    external: ['react'],
    clean: true,
  };
});
