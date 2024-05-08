import jwt, { VerifyErrors } from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { secretKey } from "../generate-token";

export const socketMiddleware = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    io.use((socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> & { user?: any }, next) => {
        const tokenFromClient = socket.handshake.auth.token;
    
        const user: any = jwt.verify(tokenFromClient, secretKey, (err: VerifyErrors | null, decoded: any) => {
            if (err) return null;
            return decoded; 
        });
    
        if (!user) {
            return next(new Error('Аутентификация не удалась'));
        }
        socket.user = user; // Сохраняем данные пользователя в сокете для использования в дальнейшем
        next();
    });
}