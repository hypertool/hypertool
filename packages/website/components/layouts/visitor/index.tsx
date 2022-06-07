import {
    FunctionComponent,
    ReactElement,
    ReactNode,
    useEffect,
    useState,
} from "react";

import axios from "axios";

import MainFooter from "./MainFooter";
import MainToolbar from "./MainToolbar";

interface Props {
    children?: ReactNode;
    toolbar?: boolean;
    footer?: boolean;
}

const VisitorLayout: FunctionComponent<Props> = (
    props: Props,
): ReactElement => {
    const { toolbar, children, footer } = props;
    const [stargazers, setStargazers] = useState(0);

    useEffect(() => {
        let mounted = true;
        (async () => {
            const url = "https://api.github.com/repos/hypertool/hypertool";
            const result = await axios.get(url);

            if (mounted) {
                setStargazers(result.data.stargazers_count);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    return (
        <>
            {toolbar && <MainToolbar stargazers={stargazers} />}
            <main>{children}</main>
            {footer && <MainFooter />}
        </>
    );
};

VisitorLayout.defaultProps = {
    toolbar: true,
    footer: true,
};

VisitorLayout.displayName = "VisitorLayout";

export default VisitorLayout;
