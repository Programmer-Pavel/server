import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export function saveUserFile(fileBuffer: any, fileName: string) {
    const filesDirectory = path.join(__dirname, 'files');

    // Путь для сохранения файла в каталоге files
    const filePath = path.join(filesDirectory, fileName);

    try {
        // Запись файла в каталог files
        fs.writeFileSync(filePath, fileBuffer);
        console.log(`Файл ${fileName} успешно сохранен`);
    } catch (err) {
        console.error(`Ошибка при сохранении файла ${fileName}:`, err);
    }
}
