import { useLocation } from "react-router-dom";

const useQueryParams = (): Record<string, string> => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const result: Record<string, string> = {};
    for (const [key, value] of params.entries() as any) {
        result[key] = value;
    }
    return result;
};

export default useQueryParams;
