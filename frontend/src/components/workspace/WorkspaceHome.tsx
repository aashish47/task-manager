import { Divider, Stack } from "@mui/material";
import { useParams } from "react-router-dom";
import useWorkspacesContext from "../../hooks/workspace/useWorkspaceContext";
import WorkspaceBoardsWithHeading from "./WorkspaceBoardsWithHeading";
import WorkspaceDetailsBar from "./WorkspaceDetailsBar";

const WorkspaceHome = () => {
    const { wid = "" } = useParams<{ wname: string; wid: string }>();
    const workpaces = useWorkspacesContext();
    const workspace = workpaces?.find((w) => w._id === wid);
    return (
        <Stack sx={{ width: "100%", maxWidth: { xs: 500, sm: 800 } }}>
            {workspace && <WorkspaceDetailsBar workspace={workspace} />}
            <Divider sx={{ my: 2 }} />
            <WorkspaceBoardsWithHeading />
        </Stack>
    );
};

export default WorkspaceHome;
