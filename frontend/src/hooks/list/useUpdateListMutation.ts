import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateList } from "../../api/api";
import { ListType } from "../../types/listTypes";
import useSocketContext from "../context/useSocketContext";

const useUpdateListMutation = () => {
    const queryClient = useQueryClient();
    const socket = useSocketContext();
    return useMutation({
        mutationFn: updateList,
        onMutate: async ({ boardId, listId, newList }) => {
            await queryClient.cancelQueries(["Lists", boardId]);
            const previousListData = queryClient.getQueryData(["Lists", boardId]) as ListType[];
            const newListData: ListType[] = queryClient.setQueryData(["Lists", boardId], (old: any) =>
                old.map((list: ListType) => {
                    if (list._id === listId) {
                        return newList;
                    }
                    return list;
                })
            );
            return { previousListData, newListData };
        },
        onSettled: (_data, error, variables, context) => {
            const { boardId } = variables;
            if (error) {
                console.log(error);
                queryClient.setQueryData(["Lists", boardId], context?.previousListData);
            }
            socket?.emit("invalidateLists", boardId);
        },
    });
};

export default useUpdateListMutation;
