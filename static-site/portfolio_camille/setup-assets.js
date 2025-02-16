import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define all required directories
const directories = [
  'public/assets',
  'public/assets/sql',
  'public/assets/images',
  'public/assets/images/previews',
  'public/assets/images/content_blocks',
  'public/assets/images/steps'
];

async function setup() {
  try {
    // Create directories
    for (const dir of directories) {
      try {
        await fs.mkdir(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
      } catch (error) {
        if (error.code !== 'EEXIST') {
          throw error;
        }
      }
    }

    // Copy SQL WASM file
    const sqlWasmSource = path.join('node_modules', '@jlongster', 'sql.js', 'dist', 'sql-wasm.wasm');
    const sqlWasmDest = path.join('public', 'assets', 'sql', 'sql-wasm.wasm');

    await fs.copyFile(sqlWasmSource, sqlWasmDest);
    console.log('Copied SQL WASM file');

    // Copy images from src/assets to public/assets/images with subdirectories
    const imageDirectories = {
      'src/assets/images': 'public/assets/images',
      'src/assets/images/previews': 'public/assets/images/previews',
      'src/assets/images/content_blocks': 'public/assets/images/content_blocks',
      'src/assets/images/steps': 'public/assets/images/steps'
    };

    for (const [srcDir, destDir] of Object.entries(imageDirectories)) {
      try {
        const files = await fs.readdir(srcDir);
        for (const file of files) {
          if (file.match(/\.(png|jpe?g|gif|svg|webp)$/i)) {
            const source = path.join(srcDir, file);
            const dest = path.join(destDir, file);
            await fs.copyFile(source, dest);
            console.log(`Copied image: ${file} to ${destDir}`);
          }
        }
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.log(`No source directory found: ${srcDir}, skipping...`);
        } else {
          throw error;
        }
      }
    }

    console.log('Setup completed successfully!');
  } catch (error) {
    console.error('Error during setup:', error);
    process.exit(1);
  }
}

setup(); 