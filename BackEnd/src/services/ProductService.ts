import { pool } from "../config/db";
import { Product } from "../models/Product";

export class ProductService {

    async getAll(): Promise<Product[]> {
        const [rows] = await pool.query("SELECT * FROM Product");
        return (rows as any[]).map(Product.fromDB);
    }

    async getById(id: number): Promise<Product | null> {
        const [rows] = await pool.query("SELECT * FROM Product WHERE ProductId = ?", [id]);
        const result = (rows as any[])[0];
        return result ? Product.fromDB(result) : null;
    }

    async create(product: Product): Promise<Product> {

        const [result]: any = await pool.query(
            "INSERT INTO Product (ProductName, Price, Description, ImageURL, Stock) VALUES (?, ?, ?, ?, ?)",
            [product.ProductName, product.Price, product.Description, product.ImageURL, product.Stock]
        );

        return new Product(
            product.ProductName, product.Price, product.Description, product.ImageURL, product.Stock
        );
    }

    async delete(id: number): Promise<void> {
        await pool.query("DELETE FROM Product WHERE ProductId = ?", [id]);
    }

    async update(product: Product): Promise<Product | null> {
        const [result]: any = await pool.query(
            "UPDATE Product SET ProductName = ?, Price = ?, Description = ?, ImageURL = ?, Stock = ? WHERE ProductId = ?",
            [product.ProductName, product.Price, product.Description, product.ImageURL, product.Stock, product.ProductID]
        );

        const [rows]: any = await pool.query("SELECT * FROM Product WHERE ProductId = ?", [product.ProductID]);

        return Product.fromDB(rows[0]);
    }

    async updateStock(productId: number, quantity: number): Promise<Product | null> {
        const [result]: any = await pool.query(
            "UPDATE Product SET Stock = Stock - ? WHERE ProductId = ? AND Stock >= ?",
            [quantity, productId, quantity]
        );

        if (result.affectedRows === 0) return null;

        const [rows]: any = await pool.query("SELECT * FROM Product WHERE ProductId = ?", [productId]);
        return Product.fromDB(rows[0]);
    }


}
