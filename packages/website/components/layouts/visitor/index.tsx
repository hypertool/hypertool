import type { FunctionComponent, ReactElement, ReactNode } from "react";

import axios from "axios";

import MainFooter from "./MainFooter";
import MainToolbar from "./MainToolbar";

interface Props {
    children?: ReactNode;
    toolbar?: boolean;
    footer?: boolean;
    stargazers: number;
}

const VisitorLayout: FunctionComponent<Props> = (
    props: Props,
): ReactElement => {
    const { toolbar, children, footer, stargazers } = props;

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

export async function getStaticProps() {
    const url = "https://api.github.com/repos/hypertool/hypertool";
    const result = await axios.get(url);
    return {
        props: {
            stargazers: result.data.stargazers_count,
        },
        /*
         * Next.js will attempt to re-generate the page:
         * - When a request comes in
         * - At most once every 1 hour
         */
        revalidate: 60 * 60,
    };
}

export default VisitorLayout;
