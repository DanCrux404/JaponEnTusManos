import { pool } from "../config/db";
import { User } from "../models/User";
import { EncryptionHandler } from "../Handlers/EncryptionHandler";

export class UserService {
    async getAll(): Promise<User[]> {
        const [rows] = await pool.query("SELECT * FROM User");
        return (rows as any[]).map(User.fromDB);
    }

    async getById(id: number): Promise<User | null> {
        const [rows] = await pool.query("SELECT * FROM User WHERE UserId = ?", [id]);
        const result = (rows as any[])[0];
        return result ? User.fromDB(result) : null;
    }

    async create(user: User): Promise<User> {
        const hashedPassword = await EncryptionHandler.hashPassword(user.PasswordHash);
        user.PasswordHash = hashedPassword;

        const [result]: any = await pool.query(
            "INSERT INTO User (Name, Email, Location, PasswordHash) VALUES (?, ?, ?, ?)",
            [user.Name, user.Email, user.Location, user.PasswordHash]
        );

        return new User(
            user.Name,
            user.Email,
            user.Location,
            user.PasswordHash
        );
    }

    async delete(id: number): Promise<void> {
        await pool.query("DELETE FROM User WHERE UserId = ?", [id]);
    }

    async update(user: User): Promise<User | null> {
        let hashedPassword = user.PasswordHash;
    
        if (!hashedPassword || hashedPassword.trim() === "") {
            const [rows]: any = await pool.query(
                "SELECT PasswordHash FROM User WHERE UserID = ?",
                [user.UserID]
            );
            hashedPassword = rows[0].PasswordHash;
        } else {
            hashedPassword = await EncryptionHandler.hashPassword(hashedPassword);
        }
    
        const [result]: any = await pool.query(
            "UPDATE User SET Name = ?, Email = ?, Location = ?, PasswordHash = ? WHERE UserID = ?",
            [user.Name, user.Email, user.Location, hashedPassword, user.UserID]
        );
    
        const [rows]: any = await pool.query(
            "SELECT * FROM User WHERE UserID = ?",
            [user.UserID]
        );
    
        return User.fromDB(rows[0]);
    }



    async login(Email: string, Password: string): Promise<User | null> {
        const [rows]: any = await pool.query("SELECT * FROM User WHERE Email = ?", [Email]);

        if (rows.length === 0) return null;

        const user = User.fromDB(rows[0]);

        const isValid = await EncryptionHandler.comparePassword(Password, user.PasswordHash);
        if (!isValid) return null;

        return user;
    }


}
