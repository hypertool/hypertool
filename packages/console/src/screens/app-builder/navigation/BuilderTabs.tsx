import type { FunctionComponent, ReactElement, SyntheticEvent } from "react";
import { useContext } from "react";

import { Icon, IconButton, Tab, Tabs } from "@mui/material";
import { styled } from "@mui/material/styles";

import { BuilderActionsContext } from "../../../contexts";
import type { ITab } from "../../../types";

const tabHeight = 48;

const StyledTabs = styled(Tabs)({
    minHeight: tabHeight,
    height: tabHeight,
    "& .MuiTab-root": {
        minHeight: tabHeight,
        height: tabHeight,
    },
});

const TabTitleText = styled("span")({
    display: "inline-block",
    marginRight: 8,
    fontSize: 12,
});

const BuilderTabs: FunctionComponent = (): ReactElement => {
    const { tabs, activeTab, setActiveTab } = useContext(BuilderActionsContext);

    const handleChange = (_event: SyntheticEvent, newActiveTab: string) => {
        setActiveTab(newActiveTab);
    };

    const renderTab = (tab: ITab) => (
        <Tab
            key={tab.id}
            value={tab.id}
            icon={<Icon fontSize="small">{tab.icon}</Icon>}
            iconPosition="start"
            label={
                <div>
                    <TabTitleText>{tab.title}</TabTitleText>
                    <IconButton size="small">
                        <Icon fontSize="small" style={{ fontSize: 14 }}>
                            close
                        </Icon>
                    </IconButton>
                </div>
            }
        />
    );

    return (
        <StyledTabs
            value={activeTab}
            onChange={handleChange}
            variant="scrollable">
            {tabs.map(renderTab)}
        </StyledTabs>
    );
};

export default BuilderTabs;