import { ReactElement } from "react";

import { styled } from "@mui/material";

import PropertiesForm from "../screens/app-builder/panels/properties-editor/PropertiesForm";
import { CraftComponent } from "../types";

import Node from "./Node";

interface IProps {
    id?: string;
    children?: ReactElement;
}

const Root = styled("div")({
    width: 400,
    height: 400,
    backgroundColor: "white",
    margin: 0,
    padding: 0,
});

const Fragment: CraftComponent<IProps> = (props: IProps): ReactElement => {
    const { children } = props;

    return (
        <Node rootProps={{ style: { margin: 16 } }}>
            <Root>{children}</Root>
        </Node>
    );
};

const defaultProps = {
    id: undefined,
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
                                id: "id",
                                title: "ID",
                                type: "text",
                                size: "small",
                                help: "The identifier of the node.",
                                required: true,
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
