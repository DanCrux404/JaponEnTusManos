import { pool } from "../config/db";
import { ChatRoom } from "../models/ChatRoom";
import { Message } from "../models/Message";

export class ChatService {

  async createRoom(userID: number): Promise<ChatRoom> {
    const [existing]: any = await pool.query(
      "SELECT * FROM ChatRoom WHERE UserID = ?",
      [userID]
    );

    if (existing.length > 0) {
      return ChatRoom.fromDB(existing[0]);
    }

    const [result]: any = await pool.query(
      "INSERT INTO ChatRoom (UserID) VALUES (?)",
      [userID]
    );

    return new ChatRoom(userID, result.insertId);
  }

  async getMessages(roomID: number): Promise<Message[]> {
    const [rows]: any = await pool.query(
      "SELECT * FROM Message WHERE RoomID = ? ORDER BY CreatedAt ASC",
      [roomID]
    );

    return rows.map((r: any) => Message.fromDB(r));
  }

  async saveMessage(
    roomID: number,
    senderType: "user" | "admin",
    senderID: number,
    content: string
  ): Promise<Message> {
    const [result]: any = await pool.query(
      "INSERT INTO Message (RoomID, SenderType, SenderID, Content) VALUES (?, ?, ?, ?)",
      [roomID, senderType, senderID, content]
    );

    return new Message(
      roomID,
      senderType,
      senderID,
      content,
      result.insertId
    );
  }
}
