import type { FunctionComponent, ReactElement } from "react";
import { useCallback } from "react";

import { CircularProgress, MenuItem, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { gql, useQuery } from "@apollo/client";

import { useFormikContext } from "formik";

import { TextField } from "../../components";
import { usePrivateSession } from "../../hooks";

const FormRoot = styled("section")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingTop: theme.spacing(4),
    width: "100%",
}));

const NameTextField = styled(TextField)({
    maxWidth: 400,
});

const TitleTextField = styled(TextField)(({ theme }) => ({
    maxWidth: 400,
    marginTop: theme.spacing(2),
}));

const OrganizationSelect = styled("div")(({ theme }) => ({
    width: 400,
    marginTop: theme.spacing(2),
}));

const Warning = styled(Typography)(({ theme }) => ({
    padding: theme.spacing(0, 2),
    fontSize: 12,
}));

const ProgressContainer = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
}));

const ProgressText = styled(Typography)(({ theme }) => ({
    fontSize: 12,
    marginRight: theme.spacing(1),
}));

const OrganizationContainer = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
}));

const OrganizationTitle = styled(Typography)(({ theme }) => ({
    fontSize: 14,
}));

const NoneOrganizationTitle = styled(Typography)(({ theme }) => ({
    fontSize: 14,
    fontStyle: "italic",
}));

const OrganizationName = styled(Typography)(({ theme }) => ({
    fontSize: 12,
}));

const DescriptionTextField = styled(TextField)(({ theme }) => ({
    maxWidth: 400,
    marginTop: theme.spacing(2),
}));

const GET_USER_ORGANIZATIONS = gql`
    query GetUserById($userId: ID!) {
        getUserById(userId: $userId) {
            organizations {
                id
                title
                name
            }
        }
    }
`;

const AboutStep: FunctionComponent = (): ReactElement => {
    const { user } = usePrivateSession();

    const { loading: loadOrganizations, data: organizationsData } = useQuery(
        GET_USER_ORGANIZATIONS,
        {
            variables: {
                userId: user.id,
            },
            notifyOnNetworkStatusChange: true,
        },
    );
    const organizations = organizationsData?.getUserById?.organizations ?? [];

    const renderOrganizationValue = useCallback(
        (organizationId) => {
            if (organizationId === "") {
                return <OrganizationName>None</OrganizationName>;
            }

            const organization = organizations.find(
                (organization: any) => organization.id === organizationId,
            );
            return <OrganizationName>{organization.name}</OrganizationName>;
        },
        [organizations],
    );

    const renderOrganizationMenuItems = useCallback(() => {
        if (loadOrganizations) {
            return (
                <ProgressContainer>
                    <ProgressText>Loading...</ProgressText>
                    <CircularProgress size="12px" />
                </ProgressContainer>
            );
        }

        if (organizations.length === 0) {
            return <Warning>You do not belong to any organizations.</Warning>;
        }

        return [
            ...organizations.map((organization: any) => (
                <MenuItem key={organization.id} value={organization.id}>
                    <OrganizationContainer>
                        <OrganizationTitle>
                            {organization.title}
                        </OrganizationTitle>
                        <OrganizationName>{organization.name}</OrganizationName>
                    </OrganizationContainer>
                </MenuItem>
            )),
            <MenuItem key="none" value="">
                <OrganizationContainer>
                    <NoneOrganizationTitle>None</NoneOrganizationTitle>
                </OrganizationContainer>
            </MenuItem>,
        ];
    }, [loadOrganizations, organizations]);

    const formik = useFormikContext() as any;

    return (
        <FormRoot>
            <NameTextField
                required={true}
                name="name"
                id="name"
                label="Name"
                size="small"
                variant="outlined"
                fullWidth={true}
                help={
                    (formik.values.name &&
                        `Your app will be hosted at ${formik.values.name}.hypertool.io`) ||
                    ""
                }
            />
            <TitleTextField
                required={true}
                name="title"
                id="title"
                label="Title"
                size="small"
                variant="outlined"
                fullWidth={true}
                help=""
            />
            {/* <OrganizationSelect>
                                    <Select
                                        id="organization"
                                        name="organization"
                                        label="Organization"
                                        variant="outlined"
                                        size="small"
                                        help=""
                                        renderMenuItems={
                                            renderOrganizationMenuItems as any
                                        }
                                        renderValue={renderOrganizationValue}
                                    />
                                </OrganizationSelect> */}
            <DescriptionTextField
                name="description"
                id="description"
                label="Description"
                size="small"
                variant="outlined"
                multiline={true}
                rows={5}
                fullWidth={true}
            />
        </FormRoot>
    );
};

export default AboutStep;
