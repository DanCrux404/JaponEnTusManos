export class Product {
    public ProductName!: string;
    public Price!: number;
    public Description!: string;
    public ImageURL!: string;
    public Stock!: number;
    public ProductID?: number;
    public CreatedAt?: string;

    constructor(ProductName: string, Price: number, Description: string, ImageURL: string, Stock: number, ProductID?: number, CreatedAt?: string) {
        this.ProductName = ProductName;
        this.Price = Price;
        this.Description = Description;
        this.ImageURL = ImageURL;
        this.Stock = Stock;
        this.ProductID = ProductID;
        this.CreatedAt = CreatedAt;
    }

    static fromDB(row: any): Product {
        return new Product(row.ProductName, row.Price, row.Description, row.ImageURL, row.Stock, row.ProductID, row.CreatedAt);
    }

    toJson() {
        return {
            ProductID: this.ProductID,
            ProductName: this.ProductName,
            Price: this.Price,
            Description: this.Description,
            ImageURL: this.ImageURL,
            Stock: this.Stock,
            CreatedAt: this.CreatedAt
        }
    }
}