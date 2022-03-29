import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useEffect } from "react";

import {
    Button,
    CircularProgress,
    Container,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";

import { gql, useMutation } from "@apollo/client";

import * as yup from "yup";
import { Formik } from "formik";
import { useNavigate } from "react-router";

import Wrap from "../../components/Wrap";

import OrganizationForm from "./OrganizationForm";

const TitleContainer = styled(Typography)(({ theme }) => ({
    color: "white",
    [theme.breakpoints.down("lg")]: {
        padding: theme.spacing(4),
        paddingBottom: theme.spacing(0),
    },
}));

const FormContainer = styled("div")(() => ({
    height: "calc(100vh - 200px)",
}));

const ActionContainer = styled("div")(() => ({
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
}));

const CreateAction = styled(Button)(({ theme }) => ({
    width: 144,
    marginLeft: theme.spacing(2),
}));

interface FormValues {
    name: string;
    description: string;
}

const initialValues: FormValues = {
    name: "",
    description: "",
};

const validationSchema = yup.object({
    name: yup
        .string()
        .max(128, "Name should be 128 characters or less")
        .required("Name is required"),
    description: yup
        .string()
        .max(512, "Description should be 512 characters or less"),
});

const CREATE_ORGANIZATION = gql`
    mutation CreateOrganization(
        $name: String!
        $title: String!
        $description: String
    ) {
        createOrganization(
            name: $name
            title: $title
            description: $description
        ) {
            id
        }
    }
`;

const NewOrganization: FunctionComponent = (): ReactElement => {
    const [createOrganization, { loading, data }] = useMutation(
        CREATE_ORGANIZATION,
        {
            refetchQueries: ["GetUserById"],
        },
    );

    const theme = useTheme();
    const navigate = useNavigate();
    const smallerThanLg = useMediaQuery(theme.breakpoints.down("lg"));
    const session = localStorage.getItem("session") as string;

    const handleSubmit = useCallback(
        (values: FormValues): any => {
            if (session) {
                createOrganization({
                    variables: {
                        ...values,
                        member: {
                            user: JSON.parse(session)?.user?.id,
                            role: "owner",
                        },
                    },
                });
            }
        },
        [createOrganization, session],
    );

    useEffect(() => {
        if (!loading && data?.createOrganization) {
            navigate("/organizations");
        }
    }, [loading, data, navigate]);

    return (
        <div>
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
            >
                {(formik) => (
                    <>
                        <TitleContainer>
                            Create your organization
                        </TitleContainer>
                        <Wrap
                            when={smallerThanLg}
                            wrapper={Container}
                            style={{ height: "calc(100vh - 156px)" }}
                        >
                            <Wrap when={!smallerThanLg} wrapper={FormContainer}>
                                <OrganizationForm />
                            </Wrap>
                        </Wrap>

                        <ActionContainer>
                            <CreateAction
                                onClick={() => formik.submitForm()}
                                variant="contained"
                                size="small"
                                disabled={loading}
                            >
                                Create
                                {!loading && (
                                    <CheckCircleOutline
                                        fontSize="small"
                                        sx={{ ml: 1 }}
                                    />
                                )}
                                {loading && (
                                    <CircularProgress
                                        size="14px"
                                        sx={{ ml: 1 }}
                                    />
                                )}
                            </CreateAction>
                        </ActionContainer>
                    </>
                )}
            </Formik>
        </div>
    );
};

export default NewOrganization;
