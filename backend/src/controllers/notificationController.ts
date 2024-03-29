import { Request, Response } from "express";
import { CustomRequest } from "../middlewares/authenticateFirebaseToken";
import NotificationService from "../services/notificationService";

export const deleteNotification = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deletedNotification = await NotificationService.deleteNotification(id);
        if (deletedNotification) {
            res.json(deletedNotification);
        } else {
            res.status(404).json({ error: "Notification not found" });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllNotifications = async (req: CustomRequest, res: Response) => {
    const uid = req.user?.uid!;
    try {
        const Notifications = await NotificationService.getAllNotifications(uid);
        res.json(Notifications);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getNotificationById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const Notification = await NotificationService.getNotificationById(id);
        if (Notification) {
            res.json(Notification);
        } else {
            res.status(404).json({ error: "Notification not found" });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
