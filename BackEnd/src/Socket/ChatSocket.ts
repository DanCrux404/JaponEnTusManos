import { Server, Socket } from "socket.io";
import { ChatService } from "../services/ChatService";

const chatService = new ChatService();

export function registerChatSocket(io: Server) {
    io.on("connection", (socket: Socket) => {
        console.log("✅ Cliente conectado:", socket.id);

        socket.on("joinRoom", async (roomID: number) => {
            console.log(`👤 Cliente ${socket.id} se unió a la sala ${roomID}`);
            socket.join(String(roomID));
            
            // Emitir las salas actualizadas solo al admin
            try {
                const rooms = await chatService.getAllRooms();
                io.emit("roomsUpdated", rooms.map((r) => r.toJson()));
            } catch (error) {
                console.error("Error al obtener salas:", error);
            }
        });

        socket.on("sendMessage", async (data) => {
            try {
                const { RoomID, SenderType, SenderID, Content } = data;
                
                console.log("📨 Mensaje recibido:", { RoomID, SenderType, SenderID, Content });

                // Guardar en base de datos
                const saved = await chatService.saveMessage(
                    RoomID,
                    SenderType,
                    SenderID,
                    Content
                );

                console.log("✅ Mensaje guardado en BD:", saved.toJson());

                // Emitir a todos en la sala (incluyendo al emisor)
                io.to(String(RoomID)).emit("newMessage", saved.toJson());
            } catch (error) {
                console.error("❌ Error al guardar mensaje:", error);
                socket.emit("messageError", { error: "No se pudo enviar el mensaje" });
            }
        });

        socket.on("disconnect", () => {
            console.log("❌ Cliente desconectado:", socket.id);
        });
    });
}