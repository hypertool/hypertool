import type { ChangeEvent, FunctionComponent, ReactElement } from "react";
import { useCallback, useState } from "react";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";

export interface Props {
    open: boolean;
    onClose: () => void;
    onCreate: (name: string) => void;
}

const NewControllerDialog: FunctionComponent<Props> = (
    props: Props,
): ReactElement => {
    const { open, onClose, onCreate } = props;

    const [name, setName] = useState("");

    const handleCreate = () => {
        onCreate(name);
    };

    const handleNameChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setName(event.target.value);
        },
        [],
    );

    return (
        <Dialog open={open} onClose={onClose} fullWidth={true}>
            <DialogTitle>Create New Controller</DialogTitle>
            <DialogContent>
                <TextField
                    id="name"
                    type="text"
                    label="Name"
                    autoFocus={true}
                    margin="dense"
                    fullWidth={true}
                    variant="outlined"
                    onChange={handleNameChange}
                    value={name}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleCreate}>Create</Button>
            </DialogActions>
        </Dialog>
    );
};

export default NewControllerDialog;
