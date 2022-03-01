import type { FunctionComponent, ReactElement, SyntheticEvent } from "react";
import { useState } from "react";

import { Icon, IconButton, Tab, Tabs } from "@mui/material";
import { styled } from "@mui/material/styles";

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

interface ITab {
    id: string;
    title: string;
    icon: string;
}

const tabs: ITab[] = [
    {
        id: "1",
        title: "New Query",
        icon: "category",
    },
    {
        id: "2",
        title: "Home",
        icon: "wysiwyg",
    },
];

const BuilderTabs: FunctionComponent = (): ReactElement => {
    const [value, setValue] = useState(0);

    const handleChange = (event: SyntheticEvent, newValue: any) => {
        setValue(newValue);
    };

    const renderTab = (tab: ITab) => (
        <Tab
            key={tab.id}
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
        <StyledTabs value={value} onChange={handleChange} variant="scrollable">
            {tabs.map(renderTab)}
        </StyledTabs>
    );
};

export default BuilderTabs;
