import { FunctionComponent, ReactElement, useCallback } from "react";

import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";

import { gql, useMutation, useQuery } from "@apollo/client";

import * as yup from "yup";
import { Formik } from "formik";

import { TextField } from "../../../../components";
import { useNotification } from "../../../../hooks";
import { slugPattern } from "../../../../utils/constants";

const Root = styled("div")(({ theme }) => ({
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "calc(100vh - 96px)",
}));

const NameTextField = styled(TextField)(({ theme }) => ({
    marginTop: theme.spacing(1),
}));

const TitleTextField = styled(TextField)(({ theme }) => ({
    marginTop: theme.spacing(3),
}));

const SlugTextField = styled(TextField)(({ theme }) => ({
    marginTop: theme.spacing(3),
}));

const FormBody = styled("div")({
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
});

const Actions = styled("div")({});

const validationSchema = yup.object({
    name: yup
        .string()
        .max(256, "Screen name should be 256 characters or less")
        .required("Title is required"),
    title: yup
        .string()
        .max(256, "Title should be 256 characters or less")
        .required("Title is required"),
    slug: yup
        .string()
        .matches(slugPattern, "Slug should be valid")
        .required("Slug is required"),
});

export interface IProps {
    screenId: string;
}

const GET_SCREEN = gql`
    query GetScreen($screenId: ID!) {
        getScreenById(screenId: $screenId) {
            id
            name
            title
            slug
            controller {
                name
            }
        }
    }
`;

const UPDATE_SCREEN = gql`
    mutation UpdateScreen(
        $screenId: ID!
        $name: String!
        $title: String!
        $slug: String!
    ) {
        updateScreen(
            screenId: $screenId
            name: $name
            title: $title
            slug: $slug
        ) {
            id
        }
    }
`;

const ScreenEditor: FunctionComponent<IProps> = (
    props: IProps,
): ReactElement => {
    const { screenId } = props;
    const notification = useNotification();
    const { data } = useQuery(GET_SCREEN, {
        variables: {
            screenId,
        },
        notifyOnNetworkStatusChange: true,
    });
    const [updateScreen] = useMutation(UPDATE_SCREEN, {
        refetchQueries: ["GetScreens"],
    });

    const handleSave = useCallback(async (values: any) => {
        try {
            await updateScreen({
                variables: {
                    screenId,
                    ...values,
                },
            });
        } catch (error: any) {
            notification.notifyError(error);
        }
    }, []);

    const {
        name = "",
        title = "",
        slug = "",
        controller: { name: controller } = { name: "" },
    } = data?.getScreenById || {};

    return (
        <Root>
            <Formik
                initialValues={{
                    name,
                    title,
                    slug,
                    controller,
                }}
                enableReinitialize={true}
                onSubmit={handleSave}
                validationSchema={validationSchema}
            >
                {(formik) => (
                    <>
                        <FormBody>
                            <NameTextField
                                id="name"
                                name="name"
                                label="Name"
                                type="text"
                                fullWidth={true}
                                variant="outlined"
                                required={true}
                                help=""
                                size="small"
                            />
                            <SlugTextField
                                id="controller"
                                name="controller"
                                label="Controller"
                                type="text"
                                fullWidth={true}
                                variant="outlined"
                                required={true}
                                help=""
                                size="small"
                                inputProps={{
                                    readOnly: true,
                                }}
                            />
                            <TitleTextField
                                id="title"
                                name="title"
                                label="Title"
                                type="text"
                                fullWidth={true}
                                variant="outlined"
                                required={true}
                                help=""
                                size="small"
                            />
                            <SlugTextField
                                id="slug"
                                name="slug"
                                label="Slug"
                                type="text"
                                fullWidth={true}
                                variant="outlined"
                                required={true}
                                help=""
                                size="small"
                            />
                        </FormBody>
                        <Actions>
                            <Button
                                variant="contained"
                                fullWidth={true}
                                type="submit"
                                onClick={formik.submitForm}
                            >
                                Save
                            </Button>
                        </Actions>
                    </>
                )}
            </Formik>
        </Root>
    );
};

export default ScreenEditor;
