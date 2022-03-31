import { ReactElement } from "react";

import { Paper } from "@mui/material";

import PropertiesForm from "../screens/app-builder/panels/properties-editor/PropertiesForm";
import { CraftComponent } from "../types";

import Node from "./Node";

interface FragmentProps {
    identifier?: string;
    children?: ReactElement | any;
}

const Fragment: CraftComponent<FragmentProps> = (
    props: FragmentProps,
): ReactElement => {
    const { identifier, children } = props;

    return (
        <Node>
            <Paper id={identifier} style={{ ...defaultStyleProps }}>
                {children}
            </Paper>
        </Node>
    );
};

const defaultStyleProps = {
    display: "flex",
    background: "#242424",
    margin: "8px",
};

const defaultProps = {
    identifier: undefined,
};

Fragment.craft = {
    props: defaultProps,
    related: {
        settings: () => (
            <PropertiesForm
                groups={[
                    {
                        title: "General",
                        fields: [
                            {
                                id: "identifier",
                                title: "Identifier",
                                type: "text",
                                size: "small",
                                help: "The identifier of the fragment.",
                            },
                        ],
                    },
                ]}
                validationSchema={undefined}
            />
        ),
    },
};

export default Fragment;
