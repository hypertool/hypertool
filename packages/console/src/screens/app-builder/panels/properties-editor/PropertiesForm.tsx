import type { FunctionComponent, ReactElement } from "react";
import { Fragment } from "react";

import {
    Chip,
    FormControl,
    FormControlLabel,
    FormGroup,
    InputLabel,
    MenuItem,
    Select,
    Switch,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { LocalizationProvider } from "@mui/lab";
import DateAdapter from "@mui/lab/AdapterMoment";

import { useNode } from "@craftjs/core";
import { Formik } from "formik";

import { TextField } from "../../../../components";
import type {
    IArtifactReference,
    IFormField,
    IFormFieldGroup,
    IFormLargeTextField,
    IFormSelect,
    IFormSwitch,
    IFormTextField,
} from "../../../../types";

import Handler from "./Handler";

const DecoratedForm = styled("form")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    width: "100%",
    padding: theme.spacing(2),
}));

const DecoratedChip = styled(Chip)({
    margin: 2,
    fontWeight: 500,
});

const DecoratedTextField = styled(TextField)(({ theme }) => ({
    margin: `${theme.spacing(1.5)} 0px`,
}));

const DecoratedFormControl = styled(FormControl)(({ theme }) => ({
    margin: `${theme.spacing(1.5)} 0px`,
}));

const DecoratedFormGroup = styled(FormGroup)(({ theme }) => ({
    margin: `${theme.spacing(1.5)} 0px`,
}));

export interface IProps {
    groups: IFormFieldGroup[];
    validationSchema: any;
}

const PropertiesForm: FunctionComponent<IProps> = (
    props: IProps,
): ReactElement => {
    const { groups, validationSchema } = props;
    const {
        actions: { setProp },
        componentProps,
    } = useNode((node) => ({
        componentProps: node.data.props,
    }));

    const makeChangeHandler =
        (field: IFormField, valueField: "value" | "checked" = "value") =>
        (event: any) => {
            setProp((props: any) => {
                props[field.id] = event.target[valueField];
            });
        };

    const makeHandlerChangeHandler =
        (field: IFormField) => (reference: IArtifactReference) => {
            setProp((props: any) => {
                props[field.id] = reference;
            });
        };

    const renderSelect = (field: IFormSelect): ReactElement => (
        <DecoratedFormControl
            variant={field.variant}
            fullWidth={true}
            required={field.required}
            size={field.size}>
            <InputLabel id={field.id}>{field.title}</InputLabel>
            <Select
                labelId={field.id}
                value={componentProps[field.id]}
                onChange={makeChangeHandler(field)}
                label={field.title}
                name={field.id}>
                {field.options.map((option) => (
                    <MenuItem value={option.value}>{option.title}</MenuItem>
                ))}
            </Select>
        </DecoratedFormControl>
    );

    const getSelectedTitle = (field: IFormSelect, selected: string): string =>
        field.options.find((option) => option.value === selected)?.title ??
        "<invalid>";

    const renderMultiSelect = (field: IFormSelect) => (
        <DecoratedFormControl
            variant={field.variant}
            fullWidth={true}
            size={field.size}>
            <InputLabel id={field.id}>{field.title}</InputLabel>
            <Select
                labelId={field.id}
                value={componentProps[field.id]}
                multiple={true}
                onChange={makeChangeHandler(field)}
                label={field.title}
                name={field.id}
                renderValue={(selected: string[]) => (
                    <div>
                        {selected.map((value) => (
                            <DecoratedChip
                                label={getSelectedTitle(field, value)}
                            />
                        ))}
                    </div>
                )}>
                {field.options.map((option) => (
                    <MenuItem value={option.value}>{option.title}</MenuItem>
                ))}
            </Select>
        </DecoratedFormControl>
    );

    const renderTextField = (field: IFormTextField): ReactElement => (
        <DecoratedTextField
            label={field.title}
            id={field.id}
            name={field.id}
            type="text"
            variant={field.variant}
            fullWidth={true}
            required={field.required}
            value={componentProps[field.id]}
            onChange={makeChangeHandler(field)}
            size={field.size}
            help={field.help}
        />
    );

    const renderLargeTextField = (field: IFormLargeTextField) => (
        <DecoratedTextField
            id={field.id}
            label={field.title}
            name={field.id}
            type="text"
            multiline={true}
            rows={field.rows || 4}
            fullWidth={true}
            variant={field.variant}
            required={field.required}
            value={componentProps[field.id]}
            onChange={makeChangeHandler(field)}
            size={field.size}
            help={field.help}
        />
    );

    const renderNumberTextField = (field: IFormTextField) => (
        <DecoratedTextField
            id={field.id}
            label={field.title}
            name={field.id}
            type="number"
            fullWidth={true}
            variant={field.variant}
            required={field.required}
            value={componentProps[field.id]}
            onChange={makeChangeHandler(field)}
            size={field.size}
            help={field.help}
        />
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const renderDateField = (field: IFormTextField) =>
        // <DatePicker
        //     id={field.id}
        //     label={field.title}
        //     name={field.id}
        //     format="MM/dd/yyyy"
        //     fullWidth={true}
        //     inputVariant="outlined"
        //     required={field.required}
        //     value={!values[field.id] ? new Date() : new Date(values[field.id])}
        //     onChange={(value) => onValueChange(field, value)}
        //     size={field.size}
        // />
        null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const renderTimeField = (field: IFormTextField) =>
        // <TimePicker
        //     id={field.id}
        //     label={field.title}
        //     name={field.id}
        //     fullWidth={true}
        //     inputVariant="outlined"
        //     required={field.required}
        //     value={!values[field.id] ? new Date() : new Date(values[field.id])}
        //     onChange={(value) => onValueChange(field, value)}
        //     size="medium"
        // />
        null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const renderDateTimeField = (field: IFormTextField) =>
        // <DateTimePicker
        //     id={field.identifier}
        //     label={field.label}
        //     name={field.identifier}
        //     fullWidth={true}
        //     inputVariant="outlined"
        //     required={field.required}
        //     value={
        //         !values[field.identifier]
        //             ? new Date()
        //             : new Date(values[field.identifier])
        //     }
        //     onChange={(value) => onValueChange(field, value)}
        //     size="medium"
        //     format="MM/dd/yyyy, hh:mm a"
        // />
        null;

    const renderSwitch = (field: IFormSwitch) => (
        <DecoratedFormGroup>
            <FormControlLabel
                id={field.id}
                label={field.title}
                name={field.id}
                control={
                    <Switch
                        color="primary"
                        size={field.size}
                        checked={componentProps[field.id]}
                        onChange={makeChangeHandler(field, "checked")}
                    />
                }
            />
        </DecoratedFormGroup>
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const renderDateRange = (field: any /*FormDateRange*/) =>
        /*
         * <div>
         *     <FormControl variant="outlined" fullWidth={true} size="medium">
         *         <InputLabel id={field.identifier}>{field.title}</InputLabel>
         *         <Select
         *             name={field.identifier}
         *             labelId={field.identifier}
         *             value={values[field.identifier].option}
         *             onChange={makeRangeHandler(field)}
         *             label={field.title}>
         *             {field.options.map((option) => (
         *                 <MenuItem value={option.value}>{option.title}</MenuItem>
         *             ))}
         *         </Select>
         *     </FormControl>
         *     {values[field.identifier].option === "custom" && (
         *         <React.Fragment>
         *             <DatePicker
         *                 margin="normal"
         *                 id={field.identifier + "Start"}
         *                 label={field.startTitle}
         *                 format="MM/dd/yyyy"
         *                 inputVariant="outlined"
         *                 fullWidth={true}
         *                 name={field.identifier + "Start"}
         *                 size="medium"
         *                 value={
         *                     !values[field.identifier].startDate
         *                         ? new Date()
         *                         : new Date(values[field.identifier].startDate)
         *                 }
         *          title      id={field.identifier + "End"}
         *                 label={field.endTitle}
         *                 format="MM/dd/yyyy"
         *                 inputVariant="outlined"
         *                 fullWidth={true}
         *                 size="medium"
         *                 value={
         *                     !values[field.identifier].endDate
         *                         ? new Date()
         *                         : new Date(values[field.identifier].endDate)
         *                 }
         *                 onChange={makeDateChangeHandler(field, "endDate")}
         *             />
         *         </React.Fragment>
         *     )}
         * </div>
         */
        null;

    const renderEmailAddressField = (field: IFormTextField) => (
        <DecoratedTextField
            id={field.id}
            label={field.title}
            name={field.id}
            type="text"
            fullWidth={true}
            variant={field.variant}
            required={field.required}
            value={componentProps[field.id]}
            onChange={makeChangeHandler(field)}
            size={field.size}
            help={field.help}
        />
    );

    const renderPhoneNumberField = (field: IFormTextField) => (
        <DecoratedTextField
            id={field.id}
            label={field.title}
            name={field.id}
            type="text"
            fullWidth={true}
            variant={field.variant}
            required={field.required}
            value={componentProps[field.id]}
            onChange={makeChangeHandler(field)}
            size={field.size}
            help={field.help}
        />
    );

    const renderHandlerField = (field: IFormTextField) => (
        <Handler
            title={field.title}
            onSelect={makeHandlerChangeHandler(field)}
            value={componentProps[field.id]}
        />
    );

    return (
        <>
            {/* <div>
                <FormControl size="small" component="fieldset">
                    <FormLabel component="legend">Size</FormLabel>
                    <RadioGroup
                        defaultValue={componentProps.size}
                        onChange={(e) =>
                            setProp(
                                (props: { size: string }) =>
                                    (props.size = e.target.value),
                            )
                        }>
                        <FormControlLabel
                            label="Small"
                            value="small"
                            control={<Radio size="small" color="primary" />}
                        />
                        <FormControlLabel
                            label="Medium"
                            value="medium"
                            control={<Radio size="small" color="primary" />}
                        />
                        <FormControlLabel
                            label="Large"
                            value="large"
                            control={<Radio size="small" color="primary" />}
                        />
                    </RadioGroup>
                </FormControl>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Variant</FormLabel>
                    <RadioGroup
                        defaultValue={componentProps.variant}
                        onChange={(e) =>
                            setProp(
                                (props: { variant: string }) =>
                                    (props.variant = e.target.value),
                            )
                        }>
                        <FormControlLabel
                            label="Text"
                            value="text"
                            control={<Radio size="small" color="primary" />}
                        />
                        <FormControlLabel
                            label="Outlined"
                            value="outlined"
                            control={<Radio size="small" color="primary" />}
                        />
                        <FormControlLabel
                            label="Contained"
                            value="contained"
                            control={<Radio size="small" color="primary" />}
                        />
                    </RadioGroup>
                </FormControl>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Color</FormLabel>
                    <RadioGroup
                        defaultValue={componentProps.color}
                        onChange={(e) =>
                            setProp(
                                (props: { color: string }) =>
                                    (props.color = e.target.value),
                            )
                        }>
                        <FormControlLabel
                            label="Default"
                            value="default"
                            control={<Radio size="small" color="default" />}
                        />
                        <FormControlLabel
                            label="Primary"
                            value="primary"
                            control={<Radio size="small" color="primary" />}
                        />
                        <FormControlLabel
                            label="Seconday"
                            value="secondary"
                            control={<Radio size="small" color="primary" />}
                        />
                    </RadioGroup>
                </FormControl>
            </div> */}

            <LocalizationProvider dateAdapter={DateAdapter}>
                <Formik
                    initialValues={componentProps}
                    enableReinitialize={true}
                    onSubmit={async () => null}
                    validationSchema={validationSchema}>
                    <DecoratedForm>
                        {groups.map((group: IFormFieldGroup) => (
                            <>
                                {group.fields.map((field) => (
                                    <Fragment key={field.id}>
                                        {field.type === "text" &&
                                            renderTextField(
                                                field as IFormTextField,
                                            )}

                                        {field.type === "large_text" &&
                                            renderLargeTextField(
                                                field as IFormLargeTextField,
                                            )}

                                        {field.type === "number" &&
                                            renderNumberTextField(
                                                field as IFormTextField,
                                            )}

                                        {field.type === "date" &&
                                            renderDateField(
                                                field as IFormTextField,
                                            )}

                                        {field.type === "time" &&
                                            renderTimeField(
                                                field as IFormTextField,
                                            )}

                                        {field.type === "date_time" &&
                                            renderDateTimeField(
                                                field as IFormTextField,
                                            )}

                                        {field.type === "switch" &&
                                            renderSwitch(field as IFormSwitch)}

                                        {field.type === "date_range" &&
                                            renderDateRange(field)}

                                        {field.type === "select" &&
                                            renderSelect(field as IFormSelect)}

                                        {field.type === "multi_select" &&
                                            renderMultiSelect(
                                                field as IFormSelect,
                                            )}

                                        {field.type === "email_address" &&
                                            renderEmailAddressField(
                                                field as IFormTextField,
                                            )}

                                        {field.type === "phone_number" &&
                                            renderPhoneNumberField(
                                                field as IFormTextField,
                                            )}

                                        {field.type === "handler" &&
                                            renderHandlerField(
                                                field as IFormTextField,
                                            )}
                                    </Fragment>
                                ))}
                            </>
                        ))}
                    </DecoratedForm>
                </Formik>
            </LocalizationProvider>
        </>
    );
};

export default PropertiesForm;
