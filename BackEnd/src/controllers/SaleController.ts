import { Request, Response } from "express";
import { SaleService } from "../services/SaleService";
import { Sale } from "../models/Sale";
import { SaleItem } from "../models/SaleItem";

export class SaleController {
    private service = new SaleService();

    createSale = async (req: Request, res: Response) => {
        try {
            const { UserID, Total, PaymentStatus, PaymentMethod, Items } = req.body;
            
            console.log("Body recibido:", req.body);
            console.log("UserID extraído:", UserID); 

            if (!Items || !Array.isArray(Items) || Items.length === 0) {
                return res.status(400).json({ message: "Sale must include at least one item" });
            }

            const sale = new Sale(UserID, Total, PaymentStatus, PaymentMethod);
            console.log("Sale creado:", sale);
            console.log("sale.UserID:", sale.UserID);
            const saleItems = Items.map((i: any) => new SaleItem(0, i.ProductID, i.Quantity, i.UnitPrice));

            const newSale = await this.service.create(sale, saleItems);
            res.status(201).json(newSale.toJson());
        } catch (error) {
            console.error("Error creating sale:", error);
            res.status(500).json({ message: "Error creating sale" });
        }
    };

    getSales = async (_req: Request, res: Response) => {
        const sales = await this.service.getAll();
        res.json(sales.map(s => s.toJson()));
    };

    getSaleById = async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const sale = await this.service.getById(id);
        if (!sale) return res.status(404).json({ message: "Sale not found" });

        const items = await this.service.getItemsBySaleId(id);
        res.json({ ...sale.toJson(), Items: items.map(i => i.toJson()) });
    };

    getSalesByUser = async (req: Request, res: Response) => {
        try {
            const userId = Number(req.params.userId);
            if (isNaN(userId)) return res.status(400).json({ message: "Invalid UserID" });

            const sales = await this.service.getByUserId(userId);

            if (sales.length === 0)
                return res.status(404).json({ message: "No sales found for this user" });

            const detailedSales = await Promise.all(
                sales.map(async sale => {
                    const items = await this.service.getItemsBySaleId(sale.SaleID!);
                    return { ...sale.toJson(), Items: items.map(i => i.toJson()) };
                })
            );

            res.json(detailedSales);
        } catch (error) {
            console.error("Error getting sales by user:", error);
            res.status(500).json({ message: "Error getting sales by user" });
        }
    };

}
