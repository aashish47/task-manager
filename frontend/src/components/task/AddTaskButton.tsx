import AddIcon from "@mui/icons-material/Add";
import { Button, Collapse } from "@mui/material";

type AddTaskButtonProps = {
    first: boolean;
    setFirst: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddTaskButton: React.FC<AddTaskButtonProps> = ({ first, setFirst }) => {
    return (
        <Collapse in={first}>
            <Button
                sx={{ alignContent: "center", justifyContent: "flex-start" }}
                size="small"
                onClick={() => setFirst((prev) => !prev)}
                variant="text"
                fullWidth
                startIcon={<AddIcon />}
            >
                Add a task
            </Button>
        </Collapse>
    );
};

export default AddTaskButton;
