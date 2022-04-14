import { TextField as MuiTextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { useFormikContext } from "formik";

const TextFieldHelp = styled(Typography)(() => ({
    display: "flex",
    marginTop: 4,
    flexDirection: "column",
    marginLeft: -8,
    marginBottom: 0,
    paddingBottom: 0,
}));

interface Props {
    name: string;
    help?: string;
    [key: string]: any;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const TextField = (props: Props) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { name, help, ...otherProps } = props;
    const formik = useFormikContext();

    const error = (formik.touched as any)[name] && (formik.errors as any)[name];

    return (
        <MuiTextField
            name={name}
            helperText={
                <>
                    {error && (
                        <TextFieldHelp variant="caption">{error}</TextFieldHelp>
                    )}
                    {!error && help}
                </>
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            error={Boolean(error)}
            {...otherProps}
            value={(formik.values as any)[name]}
        />
    );
};

export default TextField;
