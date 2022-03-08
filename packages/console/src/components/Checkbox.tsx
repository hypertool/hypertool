import { Checkbox as MuiCheckbox } from "@mui/material";

import { useFormikContext } from "formik";

interface IProps {
    name: string;
    [key: string]: any;
}

const Checkbox = (props: IProps) => {
    const { name, ...otherProps } = props;
    const formik = useFormikContext();

    return (
        <MuiCheckbox
            name={name}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            {...otherProps}
        />
    );
};

export default Checkbox;
