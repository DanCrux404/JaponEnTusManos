import express from "express";
import { ChatController } from "../controllers/ChatController";

const router = express.Router();
const controller = new ChatController();

router.post("/create-room", controller.createRoom);
router.get("/messages/:roomID", controller.getMessages);
router.post("/send", controller.sendMessage);

export default router;
