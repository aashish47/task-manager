import { Request, Response } from "express";
import mongoose from "mongoose";
import { CustomRequest } from "../middlewares/authenticateFirebaseToken";
import BoardModel from "../models/Board";
import boardService from "../services/boardService";
import listService from "../services/listService";
import taskService from "../services/taskService";

export const createList = async (req: Request, res: Response) => {
    const { boardId } = req.body;
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const newList = await listService.createList(req.body);
        const board = await BoardModel.findById(boardId);
        if (board) {
            board.addList(newList._id);
            await board.save();
        } else {
            throw new Error("Board not found");
        }
        await session.commitTransaction();
        session.endSession();
        res.json(newList);
    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ error: error.message });
    }
};

export const deleteList = async (req: Request, res: Response) => {
    const { id } = req.params;
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const deletedList = await listService.deleteList(id);
        if (deletedList) {
            await taskService.deleteTaskByListId(id);
            const boardId = deletedList.boardId;
            const board = await boardService.getBoardById(boardId);
            if (board) {
                const listsIds = board.listsIds.filter((listId) => listId !== id);
                await boardService.updateBoard(boardId, { listsIds });
                session.commitTransaction();
                session.endSession();
                res.json(deletedList);
            } else {
                session.abortTransaction();
                session.endSession();
                res.status(404).json({ error: "board not found" });
            }
        } else {
            session.abortTransaction();
            session.endSession();
            res.status(404).json({ error: "List not found" });
        }
    } catch (error: any) {
        session.abortTransaction();
        session.endSession();
        res.status(500).json({ error: error.message });
    }
};

export const getAllLists = async (req: CustomRequest, res: Response) => {
    const createdBy = req.user?.uid!;

    try {
        const lists = await listService.getAllLists(createdBy);
        res.json(lists);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getListsByBoardId = async (req: Request, res: Response) => {
    const { id: boardId } = req.params;
    try {
        const lists = await listService.getListsByBoardId(boardId);
        res.json(lists);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateList = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { newList } = req.body;

    try {
        const updatedList = await listService.updateList(id, newList);
        if (updatedList) {
            res.json(updatedList);
        } else {
            res.status(404).json({ error: "List not found" });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getListById = async (req: Request, res: Response) => {
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
