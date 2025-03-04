import { defineConfig } from "tsup";

export default defineConfig({
  entry: ['src/**/*.ts?(x)', 'src/**/*.js?(x)', 'src/**/*.json'],
  banner: {
    js: "'use client'",
  },
  splitting: true,
  format: ["esm"],
  external: ["react"],
  minify: true,
  dts: true,
  treeshake: 'smallest',
  clean: true,
});
