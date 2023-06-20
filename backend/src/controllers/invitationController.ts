import { Request, Response } from "express";
import { addCollaborator, deleteInvitationDetails, generateUniqueKey, saveInvitationDetails, validateInvitationKey } from "../services/invitationService";
import { connected, io } from "../app";
import Notification from "../models/Notification";
import notificationService from "../services/notificationService";
import mongoose from "mongoose";

export const sendInvitation = async (req: Request, res: Response) => {
    const { boardId, clientId } = req.body;
    const invitationKey = generateUniqueKey();
    let isPending = false;
    let message = "Invitation sent successfully";
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        await saveInvitationDetails(boardId, clientId, invitationKey);
        if (connected.has(clientId)) {
            io.to(clientId).emit("invitation", invitationKey);
        } else {
            isPending = true;
            message = "Invitation will be sent when user is online";
        }
        await notificationService.createNotification({ uid: clientId, description: "new invitation", isPending });
        await session.commitTransaction();
        session.endSession();
        res.status(200).json({ message });
    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ error: error.message });
    }
};

export const acceptInvitation = async (req: Request, res: Response) => {
    const { invitationKey } = req.body;
    const { boardId, clientId } = await validateInvitationKey(invitationKey);
    addCollaborator(boardId, clientId);
    await deleteInvitationDetails(invitationKey);
};
