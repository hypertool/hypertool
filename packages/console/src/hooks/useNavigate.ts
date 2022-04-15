import { useNavigate as useRRNavigate } from "react-router-dom";
import type { NavigateOptions, To } from "react-router-dom";

const useNavigate = () => {
    const navigate = useRRNavigate();
    return (to: To, options?: NavigateOptions): void => {
        if (typeof to === "string") {
            if (to.startsWith("http://") || to.startsWith("https://")) {
                window.open(to, "_blank");
            } else if (to.startsWith("/")) {
                navigate(to, options);
            } else {
                throw new Error("Unsupport URL format: " + to);
            }
        } else {
            navigate(to, options);
        }
    };
};

export default useNavigate;
