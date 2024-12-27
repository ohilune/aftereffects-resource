import { build, resolveConfig } from 'vite'; // resolveConfig をインポート
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// __dirname の代替
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// src フォルダ内のすべての .ts ファイルを取得
const getAllTsFiles = (dir) => {
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(file => file.isFile() && file.name.endsWith('.ts'))
    .map(file => path.resolve(dir, file.name));
};

// 入力ファイルを取得
const srcDir = path.resolve(__dirname, 'src');
const tsFiles = getAllTsFiles(srcDir);

// Vite 設定を取得
const getViteConfig = async () => {
  return await resolveConfig({}, 'build', 'production'); // 設定を解決
};

// 各ファイルを個別にビルド
(async () => {
  try {
    const viteConfig = await getViteConfig(); // Vite 設定を取得
    for (const file of tsFiles) {
      const fileName = path.basename(file, '.ts'); // ファイル名を取得
      await build({
        ...viteConfig, // Vite 設定を適用
        build: {
          rollupOptions: {
            input: file, // 各ファイルをエントリポイントとして設定
            output: {
              format: 'iife', // ExtendScript 用フォーマット
              dir: 'scripts', // 出力ディレクトリ
              entryFileNames: `${fileName}.jsx`, // ファイル名
            },
          },
          emptyOutDir: false, // 出力ディレクトリをクリアしない
          minify: false, // デバッグ用に最小化を無効化
        },
      });
      console.log(`ビルド完了: ${file}`);
    }
  } catch (err) {
    console.error('ビルド中にエラーが発生しました:', err);
    process.exit(1);
  }
})();
