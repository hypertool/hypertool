import { Button as MaterialButton } from "@mui/material";

export const Button = ({ size, variant, color, children }: any) => {
    return (
        <MaterialButton size={size} variant={variant} color={color}>
            {children}
        </MaterialButton>
    );
};
