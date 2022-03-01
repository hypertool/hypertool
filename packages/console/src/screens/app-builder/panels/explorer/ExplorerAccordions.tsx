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

const StyledAccordion = styled(Accordion)({});

const AccordionTitle = styled(Typography)({
    fontSize: 14,
});

const StyledAccordionDetails = styled(AccordionDetails)({
    padding: 0,
});

const ExplorerAccordions = () => {
    const renderAccordion = (id: string, title: string, node: ReactNode) => (
        <StyledAccordion key={id} disableGutters={true} square={true}>
            <AccordionSummary
                expandIcon={<Icon fontSize="small">expand_more</Icon>}
                id={`${id}-header`}>
                <AccordionTitle>{title}</AccordionTitle>
            </AccordionSummary>
            <StyledAccordionDetails>{node}</StyledAccordionDetails>
        </StyledAccordion>
    );

    return (
        <div>
            {renderAccordion("layers", "Layers", <Layers />)}
            {renderAccordion("queries", "Queries", <Queries />)}
            {renderAccordion("controllers", "Controllers", <Controllers />)}
        </div>
    );
};

export default ExplorerAccordions;
