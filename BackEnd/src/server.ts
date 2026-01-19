import dotenv from "dotenv";
dotenv.config();

import { app } from "./app";
import { createServer } from "http";
import { Server } from "socket.io";
import { registerChatSocket } from "./Socket/ChatSocket";

const PORT = process.env.PORT || 4000;

// HTTP server
const httpServer = createServer(app);

// Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

registerChatSocket(io);

// Start server
httpServer.listen(PORT, () => {
  console.log(`Server with sockets running on http://localhost:${PORT}`);
});
