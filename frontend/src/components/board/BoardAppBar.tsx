import MenuIcon from "@mui/icons-material/Menu";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { Button, ClickAwayListener, Divider, IconButton, Stack, TextField, Toolbar, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import useUpdateBoardMutation from "../../hooks/board/useUpdateBoardMutation";
import { BoardType } from "../../types/boardTypes";
import AppBar from "./AppBar";
import BoardInvite from "./BoardInvite";

type BoardAppBarProps = {
    openLeftDrawer: boolean;
    setOpenLeftDrawer: React.Dispatch<React.SetStateAction<boolean>>;
    openRightDrawer: boolean;
    setOpenRightDrawer: React.Dispatch<React.SetStateAction<boolean>>;
    board: BoardType;
};

const BoardAppBar: React.FC<BoardAppBarProps> = ({ openLeftDrawer, setOpenLeftDrawer, openRightDrawer, setOpenRightDrawer, board }) => {
    const { _id: boardId, name: boardName } = board;
    const theme = useTheme();
    const mode = theme.palette.mode;

    const [openInvite, setOpenInvite] = useState(false);
    const [editBName, setEditBName] = useState(false);
    const [inputBName, setInputBName] = useState(boardName);
    const updateBoardMutation = useUpdateBoardMutation();

    useEffect(() => {
        setInputBName(boardName);
    }, [boardName]);

    const handleLeftDrawerOpen = () => {
        setOpenLeftDrawer(true);
    };

    const handleRightDrawerOpen = () => {
        setOpenRightDrawer(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter") {
            handleClickAway();
        }
    };

    const handleClickAway = async () => {
        setEditBName(false);
        if (board && inputBName !== boardName) {
            const newBoard = { ...board, name: inputBName };
            await updateBoardMutation.mutateAsync({ boardId, newBoard });
        }
    };

    return (
        <AppBar
            sx={{ backgroundColor: mode === "dark" ? "rgb(0 0 0 / 40%)" : "rgb(255 255 255 / 40%)" }}
            position="static"
            left={openLeftDrawer}
            right={openRightDrawer}
        >
            <Toolbar sx={{ minHeight: "49px", backdropFilter: "blur(4px)" }} variant="dense">
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleLeftDrawerOpen}
                    edge="start"
                    sx={{ mr: 2, ...(openLeftDrawer && { display: "none" }) }}
                >
                    <MenuIcon />
                </IconButton>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: "100%" }}>
                    {!editBName ? (
                        <Typography
                            sx={{ "&:hover": { cursor: "pointer" }, p: "8.5px 14px" }}
                            onClick={() => setEditBName(true)}
                            variant="h6"
                            noWrap
                            component="div"
                        >
                            {inputBName}
                        </Typography>
                    ) : (
                        <ClickAwayListener onClickAway={handleClickAway}>
                            <TextField
                                sx={{ bgcolor: mode === "dark" ? "#22272b" : "#feff0026" }}
                                onFocus={(e) => e.currentTarget.setSelectionRange(0, e.currentTarget.value.length)}
                                size="small"
                                inputProps={{ style: { fontWeight: 500, fontSize: "1.25rem" } }}
                                onKeyDown={handleKeyDown}
                                value={inputBName}
                                onChange={(e) => setInputBName(e.target.value)}
                                autoFocus
                                focused
                                variant="outlined"
                            />
                        </ClickAwayListener>
                    )}
                    <Stack direction="row" gap={1}>
                        <Button
                            sx={{ alignSelf: "center" }}
                            size="small"
                            onClick={() => setOpenInvite(!openInvite)}
                            color="secondary"
                            variant="contained"
                            startIcon={<PersonAddAltIcon />}
                        >
                            Invite
                        </Button>
                        <BoardInvite board={board} open={openInvite} setOpen={setOpenInvite} />
                    </Stack>
                </Stack>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleRightDrawerOpen}
                    edge="end"
                    sx={{ ml: 2, ...(openRightDrawer && { display: "none" }) }}
                >
                    <MoreHorizIcon />
                </IconButton>
            </Toolbar>
            <Divider />
        </AppBar>
    );
};

export default BoardAppBar;
