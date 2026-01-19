import { pool } from "../config/db";
import { ChatRoom } from "../models/ChatRoom";
import { Message } from "../models/Message";

export class ChatService {
    async createRoom(userID: number): Promise<ChatRoom> {
        // Buscar sala existente
        const [existing]: any = await pool.query(
            "SELECT * FROM ChatRoom WHERE UserID = ? LIMIT 1",
            [userID],
        );

        if (existing.length > 0) {
            console.log(
                `✅ Sala existente encontrada para usuario ${userID}:`,
                existing[0].RoomID,
            );
            return ChatRoom.fromDB(existing[0]);
        }

        // Crear nueva sala solo si no existe
        const [result]: any = await pool.query(
            "INSERT INTO ChatRoom (UserID) VALUES (?)",
            [userID],
        );

        console.log(
            `🆕 Nueva sala creada para usuario ${userID}:`,
            result.insertId,
        );
        return new ChatRoom(userID, result.insertId);
    }

    async getMessages(roomID: number): Promise<Message[]> {
        const [rows]: any = await pool.query(
            "SELECT * FROM Message WHERE RoomID = ? ORDER BY CreatedAt ASC",
            [roomID],
        );

        return rows.map((r: any) => Message.fromDB(r));
    }

    async saveMessage(
        roomID: number,
        senderType: "user" | "admin",
        senderID: number,
        content: string,
    ): Promise<Message> {
        const [result]: any = await pool.query(
            "INSERT INTO Message (RoomID, SenderType, SenderID, Content) VALUES (?, ?, ?, ?)",
            [roomID, senderType, senderID, content],
        );

        return new Message(
            roomID,
            senderType,
            senderID,
            content,
            result.insertId,
        );
    }
    async getAllRooms(): Promise<ChatRoom[]> {
        // Agrupa por UserID para evitar duplicados
        const [rows]: any = await pool.query(`
            SELECT RoomID, UserID, CreatedAt
            FROM ChatRoom
            GROUP BY UserID
            ORDER BY CreatedAt DESC
        `);

        console.log(`📋 Total de salas únicas: ${rows.length}`);
        return rows.map((r: any) => ChatRoom.fromDB(r));
    }
}
