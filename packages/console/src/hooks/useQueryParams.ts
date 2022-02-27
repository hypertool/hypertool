import { useLocation } from "react-router-dom";

// eslint-disable-next-line @typescript-eslint/ban-types
const useQueryParams: Function = (): any => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const result = {};
    for (const [key, value] of (params as any).entries()) {
        (result as any)[key] = value;
    }
    return result;
};

export default useQueryParams;
