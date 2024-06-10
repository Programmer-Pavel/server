import {  Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { users } from "../database/users";
import { messages } from "../database/messages";
import { readUserFile } from "../readUserFile";
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

        const messagesWithFiles = currentUserMessages.map((el: any) => {
            if(el.fileNames) {
                const files = el.fileNames.map((el: any) => {
                    const file = readUserFile(el)
                    return file
                })
                return { ...el, files }
            }
            return el
        });

        socket.emit("messages", messagesWithFiles);
    });

    socket.on("userMessageSend", ({ message, toUserId, files }) => {
        let newMessage: any = {
            id: messages.length + 1,
            userId: socket.user.userId,
            toUserId, 
            message
        }

        if (files?.length) {
            const fileNames = files.map((el: any) => {
                saveUserFile(el.file, el.fileName)
                return el.fileName
            })
            newMessage['fileNames'] = fileNames
        }

        messages.push(newMessage)

        if(newMessage.hasOwnProperty('fileNames')) {
            const files = newMessage.fileNames.map((el: any) => {
                const file = readUserFile(el)
                return file
            })
            newMessage = { ...newMessage, files}
        }

        socket.emit("newMessage", newMessage);
        socket.to(toUserId).emit("newMessage", newMessage)
    });

    socket.on("getCurrentUserMessages", (choosedUserId: number) => {
        const currentUserMessages = messages.filter((el: any) =>
            (el.userId === socket.user.userId || el.userId === choosedUserId) 
            && (el.toUserId === choosedUserId || el.toUserId === socket.user.userId)
        )

        const messagesWithFiles = currentUserMessages.map((el: any) => {
            if(el.fileNames) {
                const files = el.fileNames.map((el: any) => {
                    const file = readUserFile(el)
                    return file
                })
                return { ...el, files }
            }
            return el
        });

        socket.emit("messages", messagesWithFiles);
    });

    socket.on("disconnect", () => {
        console.log('socket disconnect')
    });
}