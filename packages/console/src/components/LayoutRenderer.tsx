import { Button, ButtonGroup, Grid, Typography } from "@mui/material";

const MyGrid = (props: any) => {
    return (
        <Grid container={true} {...props}>
            {props.children}
        </Grid>
    );
};

const GridItem = (props: any) => {
    return <Grid {...props}>{props.children}</Grid>;
};

const Box = () => {
    return (
        <div
            style={{
                backgroundColor: "black",
                height: 400,
                width: "100%",
            }}></div>
    );
};

const components: any = {
    grid: MyGrid,
    grid_item: GridItem,
    text: Typography,
    box: Box,
    button: Button,
    button_group: ButtonGroup,
};

const renderChild = (child: any) => {
    if (child.type === "text") {
        return child.payload;
    }
    // eslint-disable-next-line no-use-before-define
    return render(child.payload);
};

const prepareProps = (attributes: any[]) => {
    const props: any = {};
    for (const attribute of attributes) {
        props[attribute.name] = attribute.value;
    }
    return props;
};

const render = (node: any) => {
    const Component = components[node.tagName];
    if (!Component) {
        // eslint-disable-next-line no-console
        console.log(node.tagName, "not found", node);
    }
    return (
        <Component {...prepareProps(node.attributes)}>
            {node.children.map(renderChild)}
        </Component>
    );
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const LayoutRenderer = (props: any) => {
    const { layout } = props;
    return render(layout);
};

export default LayoutRenderer;
