import { Button as MaterialButton } from "@mui/material";
import { useNode } from "@craftjs/core";

export const Button = ({ size, variant, color, children }: any) => {
    const {
        connectors: { connect, drag },
    } = useNode();

    return (
        <MaterialButton
            ref={(ref) => connect(drag(ref as any))}
            size={size}
            variant={variant}
            color={color}>
            {children}
        </MaterialButton>
    );
};
