import { useEffect } from "react";

const useInterval = (callback: (mouted: boolean) => void, duration: number) => {
    let mounted = true;
    const handle = setInterval(() => callback(mounted), duration);

    useEffect(
        () => () => {
            mounted = false;
            clearInterval(handle);
        },
        [],
    );
};

export default useInterval;
