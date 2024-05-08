import { Router } from 'express';
import { generateToken } from '../generate-token';
import { users } from '../database/users';

const router = Router();

// router.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
// });

// Роут для логина
router.post('/login', (req, res) => {
    const { username, password } = req.body;
     
    // Проверяем существует ли пользователь и верный ли пароль
    const findUser = users.find(el => el.username === username && el.password === password)

    if (findUser) {
        // Данные, которые будут включены в токен
        // const payload = { username };
        const token = generateToken({
            userId: findUser.id,
            username: findUser.username
        })
     
        res.json({ accessToken: token }); // Отправляем токен клиенту
    } else {
        res.status(401).send('Username or password is incorrect');
     }
    }
);

// // Роут для получения текущего юзера
// router.get('/user', (req, res) => {
//     const { username, password } = req.body;
     
//     // Проверяем существует ли пользователь и верный ли пароль
//     const findUser = users.find(el => el.username === username && el.password === password)

//     if (findUser) {
//         // Данные, которые будут включены в токен
//         // const payload = { username };
//         const token = generateToken({
//             userId: findUser.id,
//             username: findUser.username
//         })
     
//         res.json({ accessToken: token }); // Отправляем токен клиенту
//     } else {
//         res.status(401).send('Username or password is incorrect');
//      }
//     }
// );

export { router }
