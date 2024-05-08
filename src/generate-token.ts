import jwt from 'jsonwebtoken';

// Загрузите или задайте секретный ключ
export const secretKey = process.env.JWT_SECRET || 'my-secret-key';

// Укажите параметры токена, например срок действия
const options = {
    expiresIn: '24h' // 2 часа до истечения срока действия токена
};

// Генерация токена
export const generateToken = (payload: any) => {
    return jwt.sign(payload, secretKey, options)
}
