import { app } from "./app";
import { createServer } from "http";
import { Server } from "socket.io";
import { registerChatSocket } from "./Socket/ChatSocket";

const PORT = process.env.PORT || 4000;

// Crear servidor HTTP a partir de express
const httpServer = createServer(app);

// Crear Socket.IO encima del servidor HTTP
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Registrar eventos del chat
registerChatSocket(io);

// Iniciar servidor
httpServer.listen(PORT, () => {
    console.log(`Server with sockets running on http://localhost:${PORT}`);
});
