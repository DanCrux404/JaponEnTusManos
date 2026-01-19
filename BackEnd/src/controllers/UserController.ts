import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { User } from "../models/User";

export class UserController {
    private service: UserService;

    constructor() {
        this.service = new UserService();
    }

    getUsers = async (req: Request, res: Response) => {
        try {
            const users = await this.service.getAll();
            res.json(users.map(u => u.toJson()));
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error in getting users" });
        }
    };

    getUserById = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const user = await this.service.getById(id);
            if (!user) return res.status(404).json({ message: "Where the hell is the user?" });
            res.json(user.toJson());
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error in getting user" });
        }
    };

    createUser = async (req: Request, res: Response) => {
        try {
            const { Name, Email, Location, PasswordHash } = req.body;
            const user = new User(Name, Email, Location, PasswordHash);
            const newUser = await this.service.create(user);
            res.status(201).json(newUser.toJson());
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: "Error with creating user" });
        }
    };

    deleteUser = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            await this.service.delete(id);
            res.json({ message: "User is no longer with us D:" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error in deleting user" });
        }
    };

    updateUser = async (req: Request, res: Response) => {
        try {
            const { UserID, Name, Email, Location, PasswordHash } = req.body;

            const user = new User(Name, Email, Location, PasswordHash, UserID);
            const updatedUser = await this.service.update(user);

            if (!updatedUser) {
                return res.status(404).json({ message: "User was not found" });
            }

            res.status(200).json(updatedUser.toJson());
        } catch (error: any) {
            console.error("Error with updating user:", error);
            res.status(400).json({ message: "Error with updating user", error: error.message });
        }
    };

    loginUser = async (req: Request, res: Response) => {
        try {
            const { Email, Password } = req.body;

            if (!Email || !Password) {
                return res.status(400).json({ message: "Email and password are needed" });
            }

            const user = await this.service.login(Email, Password);
            if (!user) {
                return res.status(401).json({ message: "Email or password are incorrect" });
            }

            res.status(200).json({
                message: "Login successfully",
                user: user.toJson()
            });

        } catch (error: any) {
            console.error("Error en login:", error);
            res.status(500).json({ message: "Error en login", error: error.message });
        }
    };


}
