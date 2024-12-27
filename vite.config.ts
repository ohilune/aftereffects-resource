import { defineConfig } from 'vite';
import babel from '@rollup/plugin-babel';

export default defineConfig({
  plugins: [
    babel({
      babelHelpers: 'bundled',
      presets: ['@babel/preset-env'], // Babel 設定
      extensions: ['.ts', '.js'], // 処理対象の拡張子
    }),
  ],
});
