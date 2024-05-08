import {  Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { writeFile } from "fs";
import { users } from "../database/users";
import { messages } from "../database/messages";
import { saveUserFile } from "../saveUserFile";

export const socketConnectionEvent = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap> & { user?: any }) => {
    console.log('socket connect')

    socket.join(socket.user.userId);

    socket.on("getUsers", () => {
        socket.emit("users", users);
    });

    socket.on("getMessages", (choosedUserId: number) => {
        const currentUserMessages = messages.filter((el: any) =>
            (el.userId === socket.user.userId || el.userId === choosedUserId) 
            && (el.toUserId === choosedUserId || el.toUserId === socket.user.userId)
        )
        socket.emit("messages", currentUserMessages);
    });

    socket.on("userMessageSend", ({ message, toUserId }) => {
        const newMessage = {
            id: messages.length + 1,
            userId: socket.user.userId,
            toUserId, 
            message
        }

        messages.push(newMessage)

        socket.emit("newMessage", newMessage);
        socket.to(toUserId).emit("newMessage", newMessage)
    });

    socket.on("getCurrentUserMessages", (choosedUserId: number) => {
        const currentUserMessages = messages.filter((el: any) =>
            (el.userId === socket.user.userId || el.userId === choosedUserId) 
            && (el.toUserId === choosedUserId || el.toUserId === socket.user.userId)
        )
        socket.emit("messages", currentUserMessages);
    });

    socket.on("uploadFile", (fileObject: any) => {
        const { file, fileName } = fileObject
        saveUserFile()
    });

    socket.on("disconnect", () => {
        console.log('socket disconnect')
    });
}