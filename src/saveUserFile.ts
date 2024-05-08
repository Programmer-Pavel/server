import fs from 'fs';
import path from 'path';

export function saveUserFile(userId: number, fileBuffer: any, fileName: string) {
    const userDirectory = path.join(__dirname, 'files', `${userId}`); // Замените 'uploads' на нужный вам путь

    // Проверка существования каталога пользователя, если нет – создаем его
    if (!fs.existsSync(userDirectory)) {
        fs.mkdirSync(userDirectory, { recursive: true });
    }

    // Путь для сохранения файла в каталоге пользователя
    const filePath = path.join(userDirectory, fileName);

    // Запись файла в каталог пользователя
    fs.writeFile(filePath, fileBuffer, (err: any) => {
        if (err) {
            console.error(`Ошибка при сохранении файла ${fileName} для пользователя ${userId}:`, err);
        } else {
            console.log(`Файл ${fileName} успешно сохранен для пользователя ${userId}`);
        }
    });
}
