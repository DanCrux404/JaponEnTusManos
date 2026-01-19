import express from "express";
import cors from "cors";

import userRoutes from "./routes/UserRoutes";
import productRoutes from "./routes/ProductRoutes";
import adminRoutes from "./routes/AdminRoutes";
import saleRoutes from "./routes/SaleRoutes";
import chatRoutes from "./routes/ChatRoutes";

export const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/chat", chatRoutes);
