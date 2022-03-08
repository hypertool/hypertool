import type { FunctionComponent, ReactElement } from "react";

import { styled } from "@mui/material/styles";

import { TResourceType } from "../../types";

import BigQueryForm from "./BigQueryForm";
import MongoDBForm from "./MongoDBForm";
import MySQLForm from "./MySQLForm";
import PostgresForm from "./PostgresForm";

const Root = styled("section")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    width: "100%",
}));

interface IProps {
    activeType: TResourceType;
}

const ConfigureStep: FunctionComponent<IProps> = (
    props: IProps,
): ReactElement => {
    const { activeType } = props;
    return (
        <Root>
            {activeType === "postgres" && <PostgresForm />}
            {activeType === "mysql" && <MySQLForm />}
            {activeType === "mongodb" && <MongoDBForm />}
            {activeType === "bigquery" && <BigQueryForm />}
        </Root>
    );
};

export default ConfigureStep;
