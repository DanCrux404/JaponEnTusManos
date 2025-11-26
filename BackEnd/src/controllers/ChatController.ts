import { Request, Response } from "express";
import { ChatService } from "../services/ChatService";

export class ChatController {
  private service = new ChatService();

  createRoom = async (req: Request, res: Response) => {
    try {
      const { userID } = req.body;

      if (!userID)
        return res.status(400).json({ message: "userID is required" });

      const room = await this.service.createRoom(userID);
      res.status(201).json(room.toJson());
    } catch (error) {
      console.error("Error creating room:", error);
      res.status(500).json({ message: "Error creating room" });
    }
  };

  getMessages = async (req: Request, res: Response) => {
    try {
      const roomID = Number(req.params.roomID);

      const messages = await this.service.getMessages(roomID);
      res.status(200).json(messages.map((m) => m.toJson()));
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Error fetching messages" });
    }
  };

  sendMessage = async (req: Request, res: Response) => {
    try {
      const { roomID, senderType, senderID, content } = req.body;

      if (!roomID || !senderType || !senderID || !content)
        return res.status(400).json({ message: "Missing required fields" });

      const msg = await this.service.saveMessage(
        roomID,
        senderType,
        senderID,
        content
      );

      res.status(201).json(msg.toJson());
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Error sending message" });
    }
  };
}
