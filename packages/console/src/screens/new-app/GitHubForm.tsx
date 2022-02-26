import type { FunctionComponent, MouseEvent, ReactElement } from "react";
import { useCallback, useState } from "react";

import type { SelectChangeEvent } from "@mui/material";
import {
    Button,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const AuthenticateButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(3),
}));

const ConnectionButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    marginTop: theme.spacing(3),
}));

const OwnerFormControl = styled(FormControl)(({ theme }) => ({
    marginTop: theme.spacing(4),
    maxWidth: 400,
}));

const RepositoryURLTextField = styled(TextField)(({ theme }) => ({
    marginTop: theme.spacing(4),
    maxWidth: 600,
})) as any;

const VisibilityControl = styled(FormControl)(({ theme }) => ({
    marginTop: theme.spacing(2),
})) as any;

const VisibilityLabel = styled(FormControlLabel)(({ theme }) => ({
    color: theme.palette.getContrastText(theme.palette.background.default),
}));

const VisibilityCaption = styled(Typography)(({ theme }) => ({
    color: theme.palette.getContrastText(theme.palette.background.default),
})) as any;

const organizations = [
    "trell",
    "itsacademyjs",
    "hypertool",
    "paywall",
    "itshubble",
    "madewithonecube",
];

type ConnectionType = "create_repository" | "import_repository";

const GitHubForm: FunctionComponent = (): ReactElement => {
    const [authenticated, setAuthenticated] = useState(false);
    const [connection, setConnection] =
        useState<ConnectionType>("create_repository");
    const [owner, setOwner] = useState("itssamuelrowe");

    const handleAuthentication = useCallback(() => {
        setAuthenticated(true);
    }, []);

    const handleConnectionChange = useCallback(
        (event: MouseEvent<HTMLElement>, value: ConnectionType) => {
            setConnection(value);
        },
        [],
    );

    const handleOwnerChange = useCallback((event: SelectChangeEvent) => {
        setOwner(event.target.value);
    }, []);

    const renderImportFields = () => (
        <>
            <RepositoryURLTextField
                label="Repository URL"
                size="small"
                fullWidth={true}
                required={true}
            />
        </>
    );

    const renderCreateFields = () => (
        <>
            <OwnerFormControl fullWidth={true}>
                <InputLabel id="owner-label">Owner</InputLabel>
                <Select
                    labelId="owner-label"
                    id="owner"
                    value={owner}
                    label="Owner"
                    onChange={handleOwnerChange}
                    variant="outlined"
                    size="small"
                >
                    <MenuItem value="itssamuelrowe">itssamuelrowe</MenuItem>
                    {organizations.map((organization) => (
                        <MenuItem value={organization}>{organization}</MenuItem>
                    ))}
                </Select>
            </OwnerFormControl>

            <VisibilityControl component="fieldset">
                <RadioGroup defaultValue="private">
                    <VisibilityLabel
                        value="private"
                        control={<Radio size="small" />}
                        label="Private"
                    />

                    <VisibilityCaption variant="caption">
                        You choose who can see and commit to this repository.
                    </VisibilityCaption>
                    <VisibilityLabel
                        value="public"
                        control={<Radio size="small" />}
                        label="Public"
                    />

                    <VisibilityCaption variant="caption">
                        Anyone on the internet can see this repository. You
                        choose who can commit.
                    </VisibilityCaption>
                </RadioGroup>
            </VisibilityControl>
        </>
    );

    return (
        <>
            {!authenticated && (
                <AuthenticateButton
                    variant="contained"
                    size="small"
                    onClick={handleAuthentication}
                >
                    Authenticate GitHub
                </AuthenticateButton>
            )}
            {authenticated && (
                <>
                    <ConnectionButtonGroup
                        size="small"
                        value={connection}
                        onChange={handleConnectionChange}
                        exclusive={true}
                    >
                        <ToggleButton value="create_repository">
                            Create Repository
                        </ToggleButton>
                        <ToggleButton value="import_repository">
                            Import Repository
                        </ToggleButton>
                    </ConnectionButtonGroup>

                    {connection === "import_repository" && renderImportFields()}
                    {connection === "create_repository" && renderCreateFields()}
                </>
            )}
        </>
    );
};

export default GitHubForm;
