import { Request, Response } from "express";
import { CustomRequest } from "../middlewares/authenticateFirebaseToken";
import userService from "../services/userService";

export const createUser = async (req: Request, res: Response) => {
    const { uid } = req.body;

    try {
        const existingUser = await userService.getUserByUid(uid);

        if (existingUser) {
            res.status(200).json({ message: "User with the same UID already exists" });
            return;
        }

        const newUser = await userService.createUser(req.body);
        res.json(newUser);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const searchUsersByName = async (req: Request, res: Response) => {
    const { name } = req.params;
    try {
        const users = await userService.searchUsersByName(name);
        res.json(users);
    } catch (error: any) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await userService.getUserById(id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getUserByUid = async (req: CustomRequest, res: Response) => {
    const { uid } = req.params;
    try {
        const user = await userService.getUserByUid(uid);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const updatedUser = await userService.updateUser(id, req.body);
        if (updatedUser) {
            res.json(updatedUser);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deletedUser = userService.deleteUser(id);
        if (deletedUser) {
            res.json(deletedUser);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
