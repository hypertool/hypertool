import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useState } from "react";

import {
    FormControl,
    Icon,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
} from "@mui/material";

import { useFormikContext } from "formik";

interface IPasswordProps {
    name: string;
    help?: string;
    [key: string]: any;
}

const Password: FunctionComponent<IPasswordProps> = (
    props: IPasswordProps,
): ReactElement => {
    const { name, help, ...otherProps } = props;
    const formik = useFormikContext();
    const [showPassword, setShowPassword] = useState(false);

    const handleShowPassword = useCallback(() => {
        setShowPassword((showPassword) => !showPassword);
    }, []);

    const error = (formik.touched as any)[name] && (formik.errors as any)[name];

    return (
        <FormControl size="small">
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
                id="password"
                name={name}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={Boolean(error)}
                value={(formik.values as any)[name]}
                type={showPassword ? "text" : "password"}
                size="small"
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton onClick={handleShowPassword}>
                            <Icon fontSize="small">
                                {showPassword ? "visibility_off" : "visibility"}
                            </Icon>
                        </IconButton>
                    </InputAdornment>
                }
                {...otherProps}
            />
        </FormControl>
    );
};

export default Password;
