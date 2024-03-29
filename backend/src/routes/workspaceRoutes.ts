import express from "express";
import {
    createWorkspace,
    deleteWorkspace,
    getAllWorkspacesByMembers,
    getWorkspaceById,
    updateWorkspace,
    updateWorkspaceMembers,
} from "../controllers/workspaceController";

const router = express.Router();

router.get("/", getAllWorkspacesByMembers);

router.get("/:id", getWorkspaceById);

router.post("/", createWorkspace);

router.put("/:id", updateWorkspace);

router.put("/:id/members", updateWorkspaceMembers);

router.delete("/:id", deleteWorkspace);

export default router;
