import type { FunctionComponent, ReactElement } from "react";

import { useMemo } from "react";
import { Typography } from "@mui/material";
import { useFormikContext } from "formik";
import { styled } from "@mui/material/styles";
import slugify from "slugify";

import { TextField } from "../../components";

const Root = styled("section")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  width: "100%",
}));

const Form = styled("form")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  width: "100%",
}));

const NameTextField = styled(TextField)(({ theme }) => ({
  maxWidth: 400,
})) as any;

const DescriptionTextField = styled(TextField)(({ theme }) => ({
  marginTop: theme.spacing(3),
  maxWidth: 600,
})) as any;

interface FormValues {
  name: string;
}

const FormHelper: FunctionComponent = (): ReactElement => {
  const formik = useFormikContext<FormValues>();

  const slug = useMemo(
    () =>
      slugify(formik.values.name || "", {
        replacement: "-",
        lower: true,
        strict: true,
        trim: true,
      }),
    [formik.values.name]
  );

  return (
    <Root>
      <Form>
        <NameTextField
          required={true}
          name="name"
          id="name"
          label="Name"
          size="small"
          variant="outlined"
          fullWidth={true}
          help={
            <Typography
              variant="caption"
              style={{
                display: "flex",
                marginTop: 4,
                flexDirection: "column",
                marginLeft: -8,
                marginBottom: 0,
                paddingBottom: 0,
              }}
            >
              {slug && (
                <>
                  Your organization will be hosted at {slug}.hypertool.io
                </>
              )}
            </Typography>
          }
        />
        <DescriptionTextField
          name="description"
          id="description"
          label="Description"
          size="small"
          variant="outlined"
          multiline={true}
          rows={5}
          fullWidth={true}
          help={
            <Typography
              variant="caption"
              style={{
                display: "flex",
                marginTop: 4,
                flexDirection: "column",
                marginLeft: -8,
                marginBottom: 0,
                paddingBottom: 0,
              }}
            >
              A description of your organization
            </Typography>
          }
        />
      </Form>
    </Root>
  );
};

export default FormHelper;
