import type { ReactNode } from "react";

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Icon,
    Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import Controllers from "./Controllers";
import Layers from "./Layers";
import Queries from "./Queries";
import Resources from "./Resources";
import Screens from "./Screens";

const StyledAccordion = styled(Accordion)({});

const AccordionTitle = styled(Typography)({
    fontSize: 12,
});

const StyledAccordionDetails = styled(AccordionDetails)({
    padding: 0,
});

const ExpandIcon = styled(Icon)({
    fontSize: 15,
});

const AccordionIcon = styled(Icon)(({ theme }) => ({
    fontSize: 15,
    marginRight: theme.spacing(1),
}));

const ExplorerAccordions = () => {
    const renderAccordion = (
        id: string,
        title: string,
        icon: string,
        node: ReactNode,
    ) => (
        <StyledAccordion
            key={id}
            disableGutters={true}
            square={true}
            defaultExpanded={true}
        >
            <AccordionSummary
                expandIcon={<ExpandIcon>expand_more</ExpandIcon>}
                id={`${id}-header`}
            >
                <AccordionIcon>{icon}</AccordionIcon>
                <AccordionTitle>{title}</AccordionTitle>
            </AccordionSummary>
            <StyledAccordionDetails>{node}</StyledAccordionDetails>
        </StyledAccordion>
    );

    return (
        <div>
            {renderAccordion("layers", "Layers", "layers", <Layers />)}
            {renderAccordion("queries", "Queries", "workspaces", <Queries />)}
            {renderAccordion(
                "controllers",
                "Controllers",
                "source",
                <Controllers />,
            )}
            {renderAccordion("screens", "Screens", "wysiwyg", <Screens />)}
            {renderAccordion(
                "resources",
                "Resources",
                "category",
                <Resources />,
            )}
        </div>
    );
};

export default ExplorerAccordions;
