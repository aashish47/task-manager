import { Request, Response } from "express";
import listService from "../services/listService";

const createList = async (req: Request, res: Response) => {
    const { name, boardId, createdBy } = req.body;
    try {
        const newList = await listService.createList(name, boardId, createdBy);
        res.json(newList);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

const deleteList = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deletedList = await listService.deleteList(id);
        if (deletedList) {
            res.json(deletedList);
        } else {
            res.status(404).json({ error: "List not found" });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

const getAllLists = async (_req: Request, res: Response) => {
    try {
        const lists = await listService.getAllLists();
        res.json(lists);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

const updateList = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, boardId } = req.body;
    try {
        const updatedList = await listService.updateList(id, name, boardId);
        if (updatedList) {
            res.json(updatedList);
        } else {
            res.status(404).json({ error: "List not found" });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

const getListById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const list = await listService.getListById(id);
        if (list) {
            res.json(list);
        } else {
            res.status(404).json({ error: "List not found" });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export default {
    createList,
    deleteList,
    getAllLists,
    updateList,
    getListById,
};