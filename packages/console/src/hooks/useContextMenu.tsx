import type { MouseEvent } from "react";
import { useCallback, useState } from "react";

const useContextMenu = () => {
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);

    const onContextMenuOpen = useCallback((event: MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();

        setAnchor(event.currentTarget);
    }, []);

    const onContextMenuClose = useCallback(() => {
        setAnchor(null);
    }, []);

    return {
        anchor,
        onContextMenuOpen,
        onContextMenuClose,
    };
};

export default useContextMenu;
