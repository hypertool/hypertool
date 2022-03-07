import type { FunctionComponent, ReactElement } from "react";

import {
    FormControl,
    FormHelperText,
    InputLabel,
    Select as MuiSelect,
    Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useFormikContext } from "formik";

const Help = styled(Typography)({
    display: "flex",
    marginTop: 4,
    flexDirection: "column",
    marginLeft: -8,
    marginBottom: 0,
    paddingBottom: 0,
});

export interface IProps {
    id: string;
    label: string;
    name: string;
    help: string;
    renderMenuItems: () => ReactElement[];
    [key: string]: any;
}

const Select: FunctionComponent<IProps> = (props: IProps): ReactElement => {
    const { id, name, label, renderMenuItems, help, ...otherProps } = props;
    const formik = useFormikContext();
    const error = (formik.touched as any)[name] && (formik.errors as any)[name];

    return (
        <>
            <FormControl fullWidth={true}>
                <InputLabel id={`${id}-label`}>{label}</InputLabel>
                <MuiSelect
                    name={name}
                    labelId={`${id}-label`}
                    id={id}
                    value={(formik.values as any)[name]}
                    label={label}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    {...otherProps}
                >
                    {renderMenuItems()}
                </MuiSelect>
                <FormHelperText error={Boolean(error)}>
                    {error && <Help variant="caption">{error}</Help>}
                    {!error && help}
                </FormHelperText>
            </FormControl>
        </>
    );
};

export default Select;
