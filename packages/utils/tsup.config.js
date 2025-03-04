import { defineConfig } from 'tsup'

export default defineConfig((options) => {
  return {
    entry: ['src/**/*.ts?(x)', 'src/**/*.js?(x)', 'src/**/*.json'],
    format: ['esm'],
    splitting: true,
    dts: options.dts || true,
    minify: options.minify,
    sourcemap: false,
    external: ['react'],
    loader: {
      '.jpg': 'base64',
      '.svg': 'file',
      '.json': 'file',
    },
    treeshake: 'smallest',
    clean: true,
  }
})
