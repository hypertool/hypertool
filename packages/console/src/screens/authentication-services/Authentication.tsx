import { FunctionComponent, ReactElement, useState } from "react";
import { styled } from "@mui/material/styles";
import { Button, Modal, TextField, CircularProgress } from "@mui/material";

import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";

import { Formik } from "formik";
import * as yup from "yup";

import { gql, useMutation } from "@apollo/client";

import { useParams } from "react-router";

import { AuthenticationServicesType } from "../../types";

const Root = styled("div")(({ theme }) => ({
    color: theme.palette.getContrastText(theme.palette.background.default),
    display: "flex",
    marginTop: theme.spacing(2),
    justifyContent: "space-between",
    backgroundColor: theme.palette.background.paper,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    borderRadius: theme.spacing(1),

    [theme.breakpoints.up("md")]: {
        fontWeight: 500,
        fontSize: 22,
    },
}));

const Title = styled("div")(({ theme }) => ({
    color: theme.palette.getContrastText(theme.palette.background.default),

    [theme.breakpoints.up("md")]: {
        fontWeight: 400,
        fontSize: 20,
    },
}));

const ButtonContainer = styled("div")(({ theme }) => ({
    color: theme.palette.getContrastText(theme.palette.background.default),
    display: "flex",

    [theme.breakpoints.up("md")]: {
        fontWeight: 400,
        fontSize: 22,
    },
}));

const PrimaryAction = styled(Button)(({ theme }) => ({
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    borderRadius: theme.spacing(3),
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(0),

    textTransform: "none",
    width: "100%",
    [theme.breakpoints.up("md")]: {
        width: 128,
    },
}));

const ModalContainer = styled("div")(({ theme }) => ({
    color: theme.palette.getContrastText(theme.palette.background.default),
    position: "absolute",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(4),

    [theme.breakpoints.up("md")]: {
        fontWeight: 400,
        fontSize: 22,
    },
}));

const InputField = styled(TextField)(({ theme }) => ({
    width: "100%",
    marginBottom: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,

    [theme.breakpoints.up("md")]: {
        fontWeight: 400,
        fontSize: 22,
    },
}));

const ActionContainer = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
}));

const CreateAction = styled(Button)(({ theme }) => ({
    width: 144,
}));

interface FormValues {
    clientId: string;
    secret: string;
}

const initialValues: FormValues = {
    clientId: "",
    secret: "",
};

const validationSchema = yup.object({
    clientId: yup.string().required("Client Id is required"),
    secret: yup.string().required("Client Secret is required"),
});

interface Props {
    authService: AuthenticationServicesType;
}

const UPDATE_APP = gql`
    mutation UpdateApp($appId: ID!, $authServices: AuthServicesInput) {
        updateApp(appId: $appId, authServices: $authServices) {
            id
        }
    }
`;

const Authentication: FunctionComponent<Props> = (
    props: Props,
): ReactElement => {
    const { name } = props.authService;
    const { appId } = useParams();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [updateApp, { loading: updatingApp, data: updatedApp, error }] =
        useMutation(UPDATE_APP);

    const handleSubmit = (values: FormValues) => {
        updateApp({
            variables: {
                appId: appId,
                authServices: {
                    googleAuth: {
                        enabled: true,
                        clientId: values.clientId,
                        secret: values.secret,
                    },
                },
            },
        });

        if (updatedApp) {
            handleClose();
        }
    };

    return (
        <Root>
            <Title>{name}</Title>
            <ButtonContainer>
                <PrimaryAction
                    variant="contained"
                    color="primary"
                    size="medium"
                    onClick={handleOpen}
                >
                    Configure
                </PrimaryAction>
                <PrimaryAction
                    variant="contained"
                    color="primary"
                    size="medium"
                >
                    Enable
                </PrimaryAction>
            </ButtonContainer>
            <Modal open={open} onClose={handleClose}>
                <ModalContainer>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                        validationSchema={validationSchema}
                    >
                        {(formik) => (
                            <>
                                <InputField
                                    id="outlined-basic"
                                    label="Client Id"
                                    variant="outlined"
                                    name="clientId"
                                    value={formik.values.clientId}
                                    onChange={formik.handleChange}
                                />
                                <InputField
                                    id="secret"
                                    label="Client Secret"
                                    variant="outlined"
                                    name="secret"
                                    value={formik.values.secret}
                                    onChange={formik.handleChange}
                                />
                                <ActionContainer>
                                    <CreateAction
                                        onClick={() => formik.submitForm()}
                                        variant="contained"
                                        size="small"
                                        disabled={false}
                                    >
                                        Create
                                        {updatingApp && (
                                            <CircularProgress
                                                size="14px"
                                                sx={{ ml: 1 }}
                                            />
                                        )}
                                        {updatedApp && (
                                            <CheckCircleOutline
                                                fontSize="small"
                                                sx={{ ml: 1 }}
                                            />
                                        )}
                                    </CreateAction>

                                    <CreateAction
                                        onClick={handleClose}
                                        variant="contained"
                                        size="small"
                                        disabled={false}
                                    >
                                        Close
                                    </CreateAction>
                                </ActionContainer>
                            </>
                        )}
                    </Formik>
                </ModalContainer>
            </Modal>
        </Root>
    );
};

export default Authentication;
