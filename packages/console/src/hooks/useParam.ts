import { useParams } from "react-router-dom";

const useParam = (name: string): string => {
    const param = useParams()[name];
    if (!param) {
        throw new Error(`"${name}" is undefined in URL!`);
    }
    return param;
};

export default useParam;
