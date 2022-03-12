import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useContext, useEffect } from "react";

import {
    AppBar,
    Button,
    CircularProgress,
    Container,
    Divider,
    Icon,
    Toolbar,
    Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { gql, useMutation, useQuery } from "@apollo/client";

import * as yup from "yup";
import { Formik } from "formik";

import { TextField } from "../../components";
import { BuilderActionsContext, TabContext } from "../../contexts";
import { IEditQueryBundle } from "../../types";

const Title = styled(Typography)(() => ({}));

const WorkspaceToolbar = styled(Toolbar)(() => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
}));

const ActionContainer = styled("div")(() => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
}));

const ProgressContainer = styled("div")(() => ({
    width: "100%",
    display: "flex",
    flexDirection: "column",
    minHeight: "calc(100vh - 192px)",
    justifyContent: "center",
    alignItems: "center",
}));

const Root = styled("div")(() => ({
    width: "100%",
}));

const Left = styled("div")(({ theme }) => ({
    maxWidth: 280,
    marginRight: theme.spacing(4),
}));

const Right = styled("div")(() => ({
    width: "100%",
    display: "flex",
    flexDirection: "column",
    minHeight: "calc(100vh - 192px)",
}));

const Help = styled(Typography)(({ theme }) => ({
    fontSize: 14,
    color: theme.palette.getContrastText(theme.palette.background.default),
    lineHeight: 1.5,
    marginTop: theme.spacing(1),
})) as any;

const ActionIcon = styled(Icon)(({ theme }) => ({
    marginRight: theme.spacing(1),
}));

const Content = styled(Container)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    padding: theme.spacing(4),
}));

const NameTextField = styled(TextField)({
    maxWidth: 400,
});

const ResourceTextField = styled(TextField)(({ theme }) => ({
    maxWidth: 400,
    marginTop: theme.spacing(3),
}));

const DescriptionTextField = styled(TextField)(({ theme }) => ({
    maxWidth: 400,
    marginTop: theme.spacing(3),
}));

const TextFieldHelp = styled(Typography)({
    display: "flex",
    marginTop: 4,
    flexDirection: "column",
    marginLeft: -8,
    marginBottom: 0,
    paddingBottom: 0,
});

const ContentTextField = styled(TextField)(({ theme }) => ({
    maxWidth: 400,
    marginTop: theme.spacing(3),
}));

interface IFormValues {
    name: string;
    resource: null | string;
}

const validationSchema = yup.object({
    name: yup
        .string()
        .max(256, "Query name should be 256 characters or less")
        .required(),
    description: yup
        .string()
        .max(512, "Description should be 512 characters or less"),
    resource: yup.string().required(),
});

const GET_QUERY_TEMPLATE = gql`
    query GetQueryTemplate($queryTemplateId: ID!) {
        getQueryTemplateById(queryTemplateId: $queryTemplateId) {
            id
            name
            content
            resource {
                name
            }
        }
    }
`;

const UPDATE_QUERY = gql`
    mutation UpdateQueryTemplate(
        $queryTemplateId: ID!
        $name: String!
        $description: String
        $mysql: MySQLConfigurationInput
        $postgres: PostgresConfigurationInput
        $mongodb: MongoDBConfigurationInput
        $bigquery: BigQueryConfigurationInput
    ) {
        updateQueryTemplate(
            queryTemplateId: $queryTemplateId
            name: $name
            description: $description
            mysql: $mysql
            postgres: $postgres
            mongodb: $mongodb
            bigquery: $bigquery
        ) {
            id
        }
    }
`;

const EditQuery: FunctionComponent = (): ReactElement => {
    const { setTabTitle } = useContext(BuilderActionsContext);
    const { index, tab } = useContext(TabContext) || { index: -1 };
    const error = () => {
        throw new Error("Control should not reach here!");
    };
    const { queryTemplateId } = (tab?.bundle as IEditQueryBundle) || error();
    // TODO: Destructure `error`, check for non-null, send to sentry
    const { loading, data, refetch } = useQuery(GET_QUERY_TEMPLATE, {
        variables: {
            queryTemplateId,
        },
        notifyOnNetworkStatusChange: true,
    });

    const [updateQuery] = useMutation(UPDATE_QUERY);
    const {
        name = "",
        description = "",
        content = "",
        resource = { name: "" },
        type = "",
    } = data?.getQueryTemplateById ?? {};

    useEffect(() => {
        if (!name || index < 0) {
            return;
        }
        setTabTitle(index, name);
    }, [index, name, setTabTitle]);

    const handleCreateNew = () => {
        return null;
    };

    const handleRefresh = useCallback(() => {
        refetch();
    }, [refetch]);

    const handleSubmit = useCallback(
        (values: IFormValues) => {
            updateQuery({
                variables: {
                    queryTemplateId,
                    ...values,
                },
            });
        },
        [queryTemplateId, type, updateQuery],
    );

    const renderProgress = () => (
        <ProgressContainer>
            <CircularProgress size="28px" />
        </ProgressContainer>
    );

    if (loading) {
        return renderProgress();
    }

    return (
        <Formik
            initialValues={{
                name,
                description,
                content,
                resource: resource.name,
            }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
        >
            {(formik) => (
                <Root>
                    <AppBar position="static" elevation={1}>
                        <WorkspaceToolbar>
                            <Title>Edit Query</Title>
                            <ActionContainer>
                                <Button
                                    size="small"
                                    onClick={handleCreateNew}
                                    color="inherit"
                                    sx={{ mr: 2 }}
                                    disabled={loading}
                                >
                                    <ActionIcon fontSize="small">
                                        cancel
                                    </ActionIcon>
                                    Disable
                                </Button>
                                <Button
                                    size="small"
                                    color="inherit"
                                    onClick={handleCreateNew}
                                    sx={{ mr: 2 }}
                                    disabled={loading}
                                >
                                    <ActionIcon fontSize="small">
                                        delete
                                    </ActionIcon>
                                    Delete
                                </Button>
                                <Button
                                    size="small"
                                    onClick={handleRefresh}
                                    color="inherit"
                                    sx={{ mr: 2 }}
                                    disabled={loading}
                                >
                                    <ActionIcon fontSize="small">
                                        refresh
                                    </ActionIcon>
                                    Refresh
                                </Button>
                                <Button
                                    size="small"
                                    onClick={() => formik.submitForm()}
                                    color="inherit"
                                    disabled={loading}
                                >
                                    <ActionIcon fontSize="small">
                                        save
                                    </ActionIcon>
                                    Save
                                </Button>
                            </ActionContainer>
                        </WorkspaceToolbar>
                    </AppBar>
                    {!loading && (
                        <Content>
                            <Left>
                                <Help component="p" variant="caption">
                                    A query allows the client to execute
                                    commands against a resource. For example,
                                    you could write a query to fetch all the
                                    users from a MySQL table.
                                </Help>
                            </Left>
                            queryId
                            <Divider
                                orientation="vertical"
                                flexItem={true}
                                sx={{ mr: 4 }}
                            />
                            <Right>
                                <NameTextField
                                    name="name"
                                    required={true}
                                    id="name"
                                    label="Name"
                                    size="small"
                                    variant="outlined"
                                    fullWidth={true}
                                    help=""
                                    helperText={
                                        <TextFieldHelp variant="caption">
                                            The query name will help you
                                            identify the query across your
                                            Hypertool app, including code.
                                        </TextFieldHelp>
                                    }
                                />

                                <ResourceTextField
                                    name="resource"
                                    id="resource"
                                    label="Resource"
                                    size="small"
                                    variant="outlined"
                                    help=""
                                    fullWidth={true}
                                    disabled={true}
                                    required={true}
                                />

                                <DescriptionTextField
                                    name="description"
                                    id="description"
                                    label="Description"
                                    size="small"
                                    variant="outlined"
                                    help=""
                                    rows={4}
                                    multiline={true}
                                    fullWidth={true}
                                />

                                <ContentTextField
                                    name="content"
                                    id="content"
                                    label="Content"
                                    size="small"
                                    variant="outlined"
                                    help=""
                                    rows={4}
                                    multiline={true}
                                    fullWidth={true}
                                    required={true}
                                />
                            </Right>
                        </Content>
                    )}
                </Root>
            )}
        </Formik>
    );
};

export default EditQuery;
