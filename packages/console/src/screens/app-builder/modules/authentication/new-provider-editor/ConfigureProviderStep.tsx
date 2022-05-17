import type { FunctionComponent, ReactElement } from "react";

import { Divider, FormControlLabel, Icon, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { useFormikContext } from "formik";

import { Checkbox } from "../../../../../components";
import { TProviderType } from "../../../../../types";

const FormRoot = styled("section")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingTop: theme.spacing(4),
    width: "100%",
}));

const Description = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    color: theme.palette.getContrastText(theme.palette.background.default),
    gap: theme.spacing(1),
    marginTop: theme.spacing(3),
}));

const DescriptionText = styled(Typography)(({ theme }) => ({
    maxWidth: 480,
    fontSize: 14,
    lineHeight: 1.5,
}));

const EnablePasswordlessAuthenticationLabel = styled(FormControlLabel)(
    ({ theme }) => ({
        color: theme.palette.getContrastText(theme.palette.background.default),
    }),
);

export interface IConfigureProviderStepProps {
    provider: TProviderType;
}

const ConfigureProviderStep: FunctionComponent<IConfigureProviderStepProps> = (
    props: IConfigureProviderStepProps,
): ReactElement => {
    const { provider } = props;

    return (
        <FormRoot>
            <EnablePasswordlessAuthenticationLabel
                control={
                    <Checkbox
                        name="enablePasswordlessAuthentication"
                        defaultChecked={false}
                    />
                }
                label="Enable passwordless authentication"
            />

            <Description>
                <Icon fontSize="medium">info</Icon>
                <DescriptionText>
                    This authentication provider allows users to create accounts
                    using their email address and password. Further, email
                    address verification, passwordless authentication, password
                    recovery, password update, and email address change
                    primitives are supported, too. &nbsp;
                    <a href="https://docs.hypertool.io/authentication/email-password">
                        Learn more
                    </a>
                </DescriptionText>
            </Description>
        </FormRoot>
    );
};

export default ConfigureProviderStep;
