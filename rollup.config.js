import TypeScriptPlugin from 'rollup-plugin-typescript2';
import typescript from 'typescript';
import BabelPlugin from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

module.exports = {
  input: './src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'es',
      sourcemap: true,
    },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    TypeScriptPlugin({
      typescript,
    }),
    BabelPlugin({
      babelHelpers: 'bundled',
      configFile: './babel.rollup.config.js',
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    }),
    terser(),
  ],
};
