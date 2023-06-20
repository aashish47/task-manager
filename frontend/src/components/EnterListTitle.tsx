import { Collapse, Stack, TextField, Button, IconButton, useTheme } from "@mui/material";
import React from "react";
import useAuthContext from "../hooks/useAuthContext";
import CloseIcon from "@mui/icons-material/Close";
import useCreateListMutation from "../hooks/useCreateListMutation";

type EnterListTitleProp = {
    first: boolean;
    setFirst: React.Dispatch<React.SetStateAction<boolean>>;
    boardId: string;
};

const EnterListTitle: React.FC<EnterListTitleProp> = ({ first, setFirst, boardId }) => {
    const createListMutation = useCreateListMutation();
    const user = useAuthContext();
    const theme = useTheme();
    const mode = theme.palette.mode;
    const [name, setName] = React.useState("");

    const handleChangeName = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setName(event.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (user) {
            const list = { name, boardId, createdBy: user.uid };
            try {
                await createListMutation.mutateAsync(list);
                setName("");
            } catch (error) {
                console.error("An error occurred:", error);
            }
        }
    };

    return (
        <Collapse in={!first}>
            <form onSubmit={handleSubmit}>
                <Stack
                    spacing={1}
                    sx={{
                        borderRadius: 2,
                        bgcolor: mode === "dark" ? "#100901" : "#ededed",
                        p: 1,
                    }}
                >
                    <TextField
                        focused
                        autoComplete="off"
                        value={name}
                        onChange={handleChangeName}
                        sx={{ bgcolor: mode === "dark" ? "#22272b" : "white" }}
                        size="small"
                        variant="outlined"
                        placeholder="Enter list title..."
                    />
                    <Stack direction="row">
                        <Button type="submit" size="small" variant="contained">
                            Add list
                        </Button>
                        <IconButton size="small" onClick={() => setFirst((prev) => !prev)}>
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                </Stack>
            </form>
        </Collapse>
    );
};

export default EnterListTitle;
