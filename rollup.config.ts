import path from 'path';
import ts from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { defineConfig } from 'rollup';
import pkg from './package.json';


export default defineConfig({
  input: './src/index.ts',
  output: [
    { file: pkg.module, format: `es` },
    { file: pkg.module.replace('mjs', 'cjs'), format: `cjs` },
    { file: pkg.unpkg, format: `iife` },
    { file: 'dist/asker.esm-browser.js', format: `es` }
  ],

  external: ['axios', 'query-string'],
  plugins: [
    resolve(), commonjs(),
    ts({
      tsconfig: path.resolve('tsconfig.json'),
      // tsconfigOverride: {
      //   useTsconfigDeclarationDir: false,
      //   declarationDir: './dist/types'
      // }
    })
  ]
});