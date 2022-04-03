import { ReactElement } from "react";

import { styled } from "@mui/material";

import PropertiesForm from "../screens/app-builder/panels/properties-editor/PropertiesForm";
import { CraftComponent } from "../types";

import Node from "./Node";

interface IFragmentProps {
    id?: string;
    children?: ReactElement;
}

const Root = styled("div")(({ theme }) => ({
    backgroundColor: "white",
    margin: 0,
    padding: theme.spacing(2),
}));

const Grid = styled("div")({
    minHeight: 400,
    minWidth: 400,
    height: "fit-content",
    width: "fit-content",
    background: `linear-gradient(90deg, white 22px, transparent 10%) center,
		linear-gradient(white 22px, transparent 10%) center,
		black`,
    backgroundSize: `23px 23px`,
});

const FragmentNode: CraftComponent<IFragmentProps> = (
    props: IFragmentProps,
): ReactElement => {
    const { children } = props;

    return (
        <Node rootProps={{ style: { margin: 16 } }}>
            <Root>
                <Grid>{children}</Grid>
            </Root>
        </Node>
    );
};

const defaultProps = {
    id: undefined,
};

FragmentNode.craft = {
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

export default FragmentNode;
