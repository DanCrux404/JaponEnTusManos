import { Request, Response } from "express";
import { ProductService } from "../services/ProductService";
import { Product } from "../models/Product";

export class ProductController {
    private service: ProductService;

    constructor() {
        this.service = new ProductService();
    }

    getProducts = async (req: Request, res: Response) => {
        try {
            const product = await this.service.getAll();
            res.json(product.map(u => u.toJson()));
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error in getting products" });
        }
    };

    getProductById = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const product = await this.service.getById(id);
            if (!product) return res.status(404).json({ message: "Where did you put the product?" });
            res.json(product.toJson());
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error in getting product" });
        }
    };

    createProduct = async (req: Request, res: Response) => {
        try {
            const { ProductName, Price, Description, ImageURL, Stock } = req.body;
            const product = new Product(ProductName, Price, Description, ImageURL, Stock);
            const newProduct = await this.service.create(product);
            res.status(201).json(newProduct.toJson());
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: "Error with creating product" });
        }
    };

    deleteProduct = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            await this.service.delete(id);
            res.json({ message: "Product went to a better life" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error in deleting product" });
        }
    };

    updateProduct = async (req: Request, res: Response) => {
        try {
            const { ProductID, ProductName, Price, Description, ImageURL, Stock } = req.body;

            if (!ProductID) {
                return res.status(400).json({ message: "Product id is needed" });
            }

            const product = new Product(ProductName, Price, Description, ImageURL, Stock, ProductID);
            const updatedProduct = await this.service.update(product);

            if (!updatedProduct) {
                return res.status(404).json({ message: "Product was not found" });
            }

            res.status(200).json(updatedProduct.toJson());
        } catch (error: any) {
            console.error("Error with updating product:", error);
            res.status(400).json({ message: "Error with updating product", error: error.message });
        }
    };

    updateStock = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { quantity } = req.body;

        if (!quantity) return res.status(400).json({ message: "Quantity is required" });

        try {
            const updatedProduct = await this.service.updateStock(Number(id), quantity);
            if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

            res.status(200).json(updatedProduct.toJson());
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error updating stock" });
        }
    };


}
