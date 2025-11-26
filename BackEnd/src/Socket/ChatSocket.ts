import { Server } from "socket.io";
import { ChatService } from "../services/ChatService";
import { Message } from "../models/Message";

const chatService = new ChatService();

export function registerChatSocket(io: Server) {
    io.on("connection", (socket) => {
        console.log("Cliente conectado:", socket.id);

        socket.on("joinRoom", (roomID: number) => {
            socket.join(String(roomID));
            console.log(`Socket ${socket.id} unido a sala ${roomID}`);
        });

        socket.on("sendMessage", async (data) => {
            const { RoomID, SenderType, SenderID, Content } = data;

            const saved = await chatService.saveMessage(
                RoomID,
                SenderType,
                SenderID,
                Content
            );

            io.to(String(RoomID)).emit("newMessage", saved.toJson());
        });


        socket.on("disconnect", () => {
            console.log("Cliente desconectado:", socket.id);
        });
    });
}
