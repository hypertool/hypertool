import { useNode } from "@craftjs/core";
import { Paper } from "@mui/material";

export const Container = ({ background, padding = 0, children }: any) => {
    const {
        connectors: { connect, drag },
    } = useNode();

    return (
        <Paper
            ref={(ref) => connect(drag(ref as any))}
            style={{ background, padding: `${padding}px` }}
        >
            {children}
        </Paper>
    );
};
