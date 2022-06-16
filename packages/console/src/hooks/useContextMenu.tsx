import type { MouseEvent } from "react";
import { useCallback, useState } from "react";

const useContextMenu = () => {
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const [mouseX, setMouseX] = useState<number>(0);
    const [mouseY, setMouseY] = useState<number>(0);

    const onContextMenuOpen = useCallback((event: MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();

        setAnchor(event.currentTarget);
        setMouseX(event.clientX);
        setMouseY(event.clientY);
    }, []);

    const onContextMenuClose = useCallback(() => {
        setAnchor(null);
        setMouseX(0);
        setMouseY(0);
    }, []);

    return {
        anchor,
        mouseX,
        mouseY,
        onContextMenuOpen,
        onContextMenuClose,
    };
};

export default useContextMenu;
