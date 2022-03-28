import type { FunctionComponent, ReactElement } from "react";

import { FormControlLabel } from "@mui/material";
import { styled } from "@mui/material/styles";

import { gql, useQuery } from "@apollo/client";

import * as yup from "yup";
import { Formik } from "formik";
import { useParams } from "react-router-dom";

import { TextField } from "../../../../components";

const Root = styled("div")(({ theme }) => ({
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
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

const validationSchema = yup.object({
    name: yup.string().required("Title is required"),
    title: yup.string().required("Title is required"),
    slug: yup.string().required("Slug is required"),
});

export interface IProps {
    screenId: string;
}

const GET_SCREEN = gql`
    query GetScreen($appId: ID!, $screenId: ID!) {
        getScreenById(appId: $appId, screenId: $screenId) {
            id
            name
            title
            slug
        }
    }
`;

const ScreenEditor: FunctionComponent<IProps> = (
    props: IProps,
): ReactElement => {
    const { screenId } = props;
    const { appId } = useParams();
    const { data } = useQuery(GET_SCREEN, {
        variables: {
            appId,
            screenId,
        },
        notifyOnNetworkStatusChange: true,
    });

    const { name = "", title = "", slug = "" } = data?.getScreenById || {};

    return (
        <Root>
            <Formik
                initialValues={{
                    name,
                    title,
                    slug,
                }}
                enableReinitialize={true}
                onSubmit={async () => null}
                validationSchema={validationSchema}
            >
                <>
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
                </>
            </Formik>
        </Root>
    );
};

export default ScreenEditor;
