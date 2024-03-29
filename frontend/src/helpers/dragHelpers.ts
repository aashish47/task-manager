import { UseMutationResult } from "@tanstack/react-query";
import { DropResult } from "react-beautiful-dnd";
import { BoardType } from "../types/boardTypes";
import { ListType } from "../types/listTypes";
import { TaskType } from "../types/taskTypes";

export const onDragEnd = async (
    result: DropResult,
    moveTaskMutation: UseMutationResult<
        any,
        unknown,
        { boardId: string; taskId: string; startListId: string; finishListId: string; newStartList: ListType; newFinishList: ListType },
        { previousData: { previousTaskData: TaskType[]; previousListData: ListType[] }; newData: { newTaskData: TaskType[]; newListData: ListType[] } }
    >,
    updateListMutation: UseMutationResult<
        any,
        unknown,
        { boardId: string; listId: string; newList: ListType },
        { previousListData: ListType[]; newListData: ListType[] }
    >,
    updateBoardMutation: UseMutationResult<
        any,
        unknown,
        { boardId: string; newBoard: BoardType },
        { previousBoardData: BoardType[]; newBoardData: BoardType[] }
    >,
    lists: any[] | undefined,
    board: BoardType | null | undefined
) => {
    const { draggableId, source, destination, type } = result;

    if (!destination) {
        return;
    }
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
        return;
    }

    if (type === "lists" && board) {
        const newListsIds = Array.from(board.listsIds);
        newListsIds.splice(source.index, 1);
        newListsIds.splice(destination.index, 0, draggableId);
        const newBoard = { ...board, listsIds: newListsIds } as BoardType;

        try {
            await updateBoardMutation.mutateAsync({ boardId: board._id, newBoard });
        } catch (error) {
            console.error("Error updating Board lists:", error);
        }
        return;
    }

    const startList = lists?.find((list) => list._id === source.droppableId);
    const finishList = lists?.find((list) => list._id === destination.droppableId);

    if (startList && finishList && board) {
        if (startList === finishList) {
            const newTasksIds = Array.from(startList.tasksIds);
            newTasksIds.splice(source.index, 1);
            newTasksIds.splice(destination.index, 0, draggableId);
            const newList = { ...startList, tasksIds: newTasksIds } as ListType;

            try {
                await updateListMutation.mutateAsync({ boardId: board._id, listId: startList._id, newList });
            } catch (error) {
                console.error("Error updating list tasks:", error);
            }
        } else {
            const newStartTasksIds = Array.from(startList.tasksIds);
            newStartTasksIds.splice(source.index, 1);
            const newStartList = { ...startList, tasksIds: newStartTasksIds } as ListType;

            const newFinishTasksIds = Array.from(finishList.tasksIds);
            newFinishTasksIds.splice(destination.index, 0, draggableId);
            const newFinishList = { ...finishList, tasksIds: newFinishTasksIds } as ListType;

            try {
                await moveTaskMutation.mutateAsync({
                    boardId: board._id,
                    taskId: draggableId,
                    startListId: startList._id,
                    finishListId: finishList._id,
                    newStartList,
                    newFinishList,
                });
            } catch (error) {
                console.error("Error updating list tasks:", error);
            }
        }
    }
};
