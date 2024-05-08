import express from 'express';
import { createServer } from 'node:http';
import cors from 'cors'
// import { fileURLToPath } from 'node:url';
// import { dirname, join } from 'node:path';

import { Server, Socket } from "socket.io";
import { router } from './routes/routes';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { socketConnectionEvent } from './socket-io/socketConnectionEvent';
import { socketMiddleware } from './socket-io/socketMiddleware';

const app = express();

// Задаем опции для CORS
const corsOptions = {
    origin: 'http://localhost:8080', // Замените звездочку на ваш домен, если хотите ограничить доступ
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Используем express.json() для разбора JSON в теле запроса
app.use(express.json());

app.use(router);

// const __dirname = dirname(fileURLToPath(import.meta.url));

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:8080",
    credentials: true
  },
});

socketMiddleware(io)

const onConnection = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) => {
  socketConnectionEvent(socket);
}

io.on("connection", onConnection);

httpServer.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});