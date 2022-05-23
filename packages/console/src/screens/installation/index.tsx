import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useState } from "react";

import Welcome from "./Welcome";

const Installation: FunctionComponent = (): ReactElement => {
    const [start, setStart] = useState(false);

    const handleStart = useCallback(() => {
        setStart(true);
    }, []);

    return (
        <div>
            {!start && <Welcome onPrimaryAction={handleStart} />}
            {start && <div>Stepper</div>}
        </div>
    );
};

export default Installation;
