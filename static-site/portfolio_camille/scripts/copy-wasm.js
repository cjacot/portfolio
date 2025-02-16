import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const copyWasm = async () => {
  try {
    const sourceWasmPath = resolve(__dirname, '../node_modules/@jlongster/sql.js/dist/sql-wasm.wasm');
    const targetWasmPath = resolve(__dirname, '../public/sql-wasm.wasm');

    // Ensure the public directory exists
    await fs.mkdir(dirname(targetWasmPath), { recursive: true });

    // Copy the WASM file
    await fs.copyFile(sourceWasmPath, targetWasmPath);
    console.log('✅ WASM file copied successfully!');
  } catch (error) {
    console.error('❌ Error copying WASM file:', error);
    process.exit(1);
  }
};

copyWasm(); 