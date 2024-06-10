import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export function readUserFile(fileName: string) {
    const filesDirectory = path.join(__dirname, 'files');

    // Путь для сохранения файла в каталоге files
    const filePath = path.join(filesDirectory, fileName);

    let file

    try {
        // Чтение файла из каталога files
        file = fs.readFileSync(filePath);
    } catch (err) {
        console.error('Error reading file:', err);
    }
    
    return file
}
