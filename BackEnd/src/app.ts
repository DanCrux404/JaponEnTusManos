import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/UserRoutes";
import productRoutes from "./routes/ProductRoutes";
import adminRoutes from "./routes/AdminRoutes";
import SaleRoutes from "./routes/SaleRoutes"
import chatRoutes from "./routes/ChatRoutes";

dotenv.config();

export const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/sales",SaleRoutes);
app.use("/api/chat", chatRoutes);