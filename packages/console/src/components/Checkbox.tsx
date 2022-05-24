import { Checkbox as MuiCheckbox } from "@mui/material";

import { useFormikContext } from "formik";

interface Props {
    name: string;
    [key: string]: any;
}

const Checkbox = (props: Props) => {
    const { name, ...otherProps } = props;
    const formik: any = useFormikContext();

    return (
        <MuiCheckbox
            name={name}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            checked={Boolean(formik[name])}
            {...otherProps}
        />
    );
};

export default Checkbox;
