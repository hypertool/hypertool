import type { FunctionComponent, MouseEvent } from "react";
import { useCallback, useState } from "react";

import { Icon, InputAdornment, Menu, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

import { IconMenuItem, NestedMenuItem } from "../../../../components";
import { useModulesArray } from "../../../../hooks";
import type { IModule, ISymbolReference } from "../../../../types";

const DecoratedTextField = styled(TextField)(({ theme }) => ({
    margin: `${theme.spacing(1.5)} 0px`,
    ".MuiOutlinedInput-input": {
        cursor: "pointer",
    },
    ".MuiOutlinedInput-root": {
        "&:hover fieldset": {
            cursor: "pointer",
        },
    },
}));

export interface Props {
    title: string;
    onSelect: (reference: ISymbolReference) => void;
    value?: ISymbolReference;
}

const Handler: FunctionComponent<Props> = (props: Props) => {
    const { title, onSelect, value } = props;

    const [anchor, setAnchor] = useState<(EventTarget & Element) | null>(null);
    const open = Boolean(anchor);

    const modules = useModulesArray();
    const handleClick = useCallback((event: MouseEvent<Element>) => {
        setAnchor(event.currentTarget);
    }, []);

    const makeSelectHandler = (module: IModule, target: string) => () => {
        onSelect({
            moduleId: module.id,
            target,
        });
        setAnchor(null);
    };

    const handleClose = useCallback(() => {
        setAnchor(null);
    }, []);

    const renderModule = (module: IModule) => (
        <NestedMenuItem
            key={module.id}
            leftIcon={<Icon fontSize="small">functions</Icon>}
            rightIcon={<Icon fontSize="small">chevron_right</Icon>}
            label={module.id}
            parentMenuOpen={open}
        >
            {module.symbols.map((target) => (
                <IconMenuItem
                    key={target}
                    onClick={makeSelectHandler(module, target)}
                    leftIcon={<Icon fontSize="small">{"\uD835\uDC53"}</Icon>}
                    label={target}
                />
            ))}
        </NestedMenuItem>
    );

    return (
        <>
            <DecoratedTextField
                variant="outlined"
                onClick={handleClick}
                fullWidth={true}
                size="small"
                label={title}
                value={
                    value
                        ? `${value.moduleId} \u2192 ${value.target}`
                        : "<undefined>"
                }
                inputProps={{
                    readOnly: true,
                }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <Icon>arrow_drop_down</Icon>
                        </InputAdornment>
                    ),
                }}
            />
            <Menu anchorEl={anchor} open={open} onClose={handleClose}>
                {modules.map(renderModule)}
            </Menu>
        </>
    );
};

export default Handler;
