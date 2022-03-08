/* eslint-disable no-undef */
import type {
    FocusEvent,
    ForwardRefRenderFunction,
    ForwardedRef,
    KeyboardEvent,
    MouseEvent,
    ReactElement,
    ReactNode,
} from "react";
import {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useRef,
    useState,
} from "react";

import { Icon, Menu } from "@mui/material";

import IconMenuItem from "./IconMenuItem";

export interface IProps {
    parentMenuOpen: boolean;
    label?: string;
    rightIcon?: ReactNode;
    leftIcon?: ReactNode;
    children?: ReactNode;
    className?: string;
    tabIndex?: number;
    ContainerProps?: any;
    MenuItemProps?: any;
    disabled?: boolean;
}

const NestedMenuItem: ForwardRefRenderFunction<IProps, any> = (
    props: IProps,
    ref: ForwardedRef<any>,
): ReactElement => {
    const {
        parentMenuOpen,
        label,
        rightIcon = <Icon>chevron_right_rounded</Icon>,
        leftIcon = null,
        children,
        className,
        tabIndex: tabIndexProp,
        ContainerProps: ContainerPropsProp = {},
        disabled,
        ...MenuItemProps
    } = props;

    const { ref: containerRefProp, ...ContainerProps } = ContainerPropsProp;

    const menuItemRef = useRef(null);
    useImperativeHandle(ref, () => menuItemRef.current);

    const containerRef = useRef<HTMLElement | null>(null);
    useImperativeHandle(containerRefProp, () => containerRef.current);

    const menuContainerRef = useRef<HTMLElement | null>(null);
    const [subMenuOpen, setSubMenuOpen] = useState(false);

    const handleMouseEnter = useCallback((event: MouseEvent<HTMLElement>) => {
        setSubMenuOpen(true);

        if (ContainerProps.onMouseEnter) {
            ContainerProps.onMouseEnter(event);
        }
    }, []);

    const handleMouseLeave = useCallback((event: MouseEvent<HTMLElement>) => {
        setSubMenuOpen(false);

        if (ContainerProps.onMouseLeave) {
            ContainerProps.onMouseLeave(event);
        }
    }, []);

    /* Check if any immediate children are active */
    const isSubmenuFocused = () => {
        const active = containerRef.current?.ownerDocument.activeElement;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const child of (menuContainerRef.current?.children as any) ?? []) {
            if (child === active) {
                return true;
            }
        }
        return false;
    };

    const handleFocus = (event: FocusEvent<HTMLElement>) => {
        if (event.target === containerRef.current) {
            setSubMenuOpen(true);
        }

        if (ContainerProps.onFocus) {
            ContainerProps.onFocus(event);
        }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
        if (event.key === "Escape") {
            return;
        }

        if (isSubmenuFocused()) {
            event.stopPropagation();
        }

        const active = containerRef.current?.ownerDocument.activeElement;

        if (event.key === "ArrowLeft" && isSubmenuFocused()) {
            containerRef.current?.focus();
        }

        if (
            event.key === "ArrowRight" &&
            event.target === containerRef.current &&
            event.target === active
        ) {
            const firstChild = menuContainerRef.current
                ?.children[0] as HTMLElement;
            firstChild?.focus();
        }
    };

    const open = subMenuOpen && parentMenuOpen;

    /* Root element must have a `tabIndex` attribute for keyboard navigation. */
    let tabIndex;
    if (!disabled) {
        tabIndex = tabIndexProp !== undefined ? tabIndexProp : -1;
    }

    return (
        <div
            {...ContainerProps}
            ref={containerRef}
            onFocus={handleFocus}
            tabIndex={tabIndex}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onKeyDown={handleKeyDown}>
            {IconMenuItem({
                MenuItemProps,
                className,
                ref: menuItemRef,
                leftIcon,
                rightIcon,
                label,
            })}

            <Menu
                /*
                 * Set pointer events to 'none' to prevent the invisible popover
                 * div from capturing events for clicks and hovers.
                 */
                style={{ pointerEvents: "none" }}
                anchorEl={menuItemRef.current}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                open={open}
                autoFocus={false}
                disableAutoFocus
                disableEnforceFocus
                onClose={() => {
                    setSubMenuOpen(false);
                }}>
                <div
                    ref={menuContainerRef as any}
                    style={{ pointerEvents: "auto" }}>
                    {children}
                </div>
            </Menu>
        </div>
    );
};

export default forwardRef(NestedMenuItem);
