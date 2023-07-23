import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import { Box, Divider, IconButton, Stack } from "@mui/material";
import { ReactNode, useState } from "react";
import { useParams } from "react-router-dom";
import Main from "../components/board/Main";
import WorkspaceDetailsBar from "../components/workspace/WorkspaceDetailsBar";
import WorkspaceDrawer from "../components/workspace/WorkspaceDrawer";
import useWorkspacesContext from "../hooks/workspace/useWorkspaceContext";

type WorkspaceLayoutProps = {
    children: ReactNode;
};

const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({ children }) => {
    const { wid: workspaceId = "" } = useParams();
    const workspaceData = useWorkspacesContext();
    let workspace = workspaceData ? workspaceData.find((workspace) => workspace._id === workspaceId) : null;
    if (!workspace) {
        workspace = {
            createdAt: "",
            createdBy: "",
            description: "",
            name: "",
            updatedAt: "",
            __v: 0,
            _id: "",
        };
    }

    const { description, name: wname } = workspace;
    const [openLeftDrawer, setOpenLeftDrawer] = useState(true);
    return (
        <Stack direction="row">
            <WorkspaceDrawer open={openLeftDrawer} setOpen={setOpenLeftDrawer} workspace={workspace} />

            <Main left={openLeftDrawer}>
                <Stack direction="row">
                    {!openLeftDrawer && (
                        <IconButton sx={{ alignSelf: "flex-start" }} color="inherit" onClick={() => setOpenLeftDrawer(true)}>
                            <ArrowCircleRightIcon fontSize="large" />
                        </IconButton>
                    )}
                    <Box sx={{ m: 5, width: "100vw" }}>
                        <Stack>
                            <WorkspaceDetailsBar wname={wname} description={description} />
                            <Divider sx={{ my: 2 }} />
                            {children}
                        </Stack>
                    </Box>
                </Stack>
            </Main>
        </Stack>
    );
};

export default WorkspaceLayout;
