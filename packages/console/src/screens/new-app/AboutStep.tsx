import type { FunctionComponent, ReactElement } from "react";
import { useMemo } from "react";

import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { useFormikContext } from "formik";
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

const Form = styled("form")(() => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
}));

const NameTextField = styled(TextField)(() => ({
    maxWidth: 400,
})) as any;

const DescriptionTextField = styled(TextField)(({ theme }) => ({
    marginTop: theme.spacing(3),
    maxWidth: 600,
})) as any;

/*
 * const FolderFormControl = styled(FormControl)(({ theme }) => ({
 *   marginTop: theme.spacing(3),
 *   maxWidth: 400,
 * }));
 */

// const dummyFolders = ["eCommerce", "content", "human-resource", "tech"];

interface FormValues {
    name: string;
}

const AboutStep: FunctionComponent = (): ReactElement => {
    const formik = useFormikContext<FormValues>();
    // const [folder, setFolder] = useState("root");

    /*
     * const handleFolderChange = useCallback((event: SelectChangeEvent) => {
     *   setFolder(event.target.value);
     * }, []);
     */

    const slug = useMemo(
        () =>
            slugify(formik.values.name || "", {
                replacement: "-",
                lower: true,
                strict: true,
                trim: true,
            }),
        [formik.values.name],
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
                            }}>
                            Good app names are short and memorable.
                            {slug && (
                                <>
                                    <br />
                                    Your app will be hosted at:
                                    <a
                                        href="https://trell.hypertool.io/thumbnail-generator"
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{ color: "white" }}>
                                        https://trell.hypertool.io/{slug}
                                    </a>
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
                            }}>
                            A good description will help your users know about
                            your app better.
                        </Typography>
                    }
                />
                {/* <FolderFormControl fullWidth={true}>
          <InputLabel id="folder-label">Folder</InputLabel>
          <Select
            labelId="folder-label"
            id="folder"
            value={folder}
            label="Folder"
            onChange={handleFolderChange}
            size="small"
            variant="outlined"
          >
            <MenuItem value="root">root</MenuItem>
            {dummyFolders.map((folder) => (
              <MenuItem value={folder}>{folder}</MenuItem>
            ))}
          </Select>
        </FolderFormControl> */}
            </Form>
        </Root>
    );
};

export default AboutStep;
