import { useContext, useEffect } from "react";

import { BuilderActionsContext, TabContext } from "../contexts";

const useUpdateTabTitle = (title?: string): void => {
    const { setTabTitle } = useContext(BuilderActionsContext);
    const error = () => {
        throw new Error("Tab context not found.");
    };
    const { index } = useContext(TabContext) || error();
    useEffect(() => {
        if (!title) {
            return;
        }
        setTabTitle(index, title);
    }, [index, title, setTabTitle]);
};

export default useUpdateTabTitle;
