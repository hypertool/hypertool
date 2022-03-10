import type { FunctionComponent, ReactElement } from "react";

import { Indicator, useEditor } from "../../../../../craft";

export interface Props {
    placeholder: Indicator;
    suggestedStyles: any;
}

export const LayerIndicator: FunctionComponent<Props> = (
    props: Props,
): ReactElement => {
    const { placeholder, suggestedStyles } = props;
    const { indicator } = useEditor((state) => ({
        indicator: state.options.indicator,
    }));

    return (
        <div
            style={{
                position: "fixed",
                display: "block",
                opacity: 1,
                borderColor: placeholder.error
                    ? indicator.error
                    : indicator.success,
                borderStyle: "solid",
                borderWidth: "1px",
                zIndex: "99999",
                ...suggestedStyles,
            }}
        ></div>
    );
};
