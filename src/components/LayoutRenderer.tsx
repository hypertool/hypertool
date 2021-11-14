import { Grid, Typography } from "@mui/material";

const MyGrid = (props: any) => {
    return <Grid container={true} {...props}>{props.children}</Grid>;
}

const GridItem = (props: any) => {
    console.log(props);
    return <Grid {...props}>{props.children}</Grid>;
};

const components: any = {
    grid: MyGrid,
    grid_item: GridItem,
    text: Typography,
};

const renderChild = (child: any) => {
    if (child.type === "text") {
        return child.payload;
    }
    return render(child.payload);
}

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
        console.log(node.tagName, "not found", node);
    }
    return <Component {...prepareProps(node.attributes)}>
            {node.children.map(renderChild)}
        </Component>;
};

const LayoutRenderer = (props: any) => {
    const { layout } = props;
    return render(layout);
};

export default LayoutRenderer;