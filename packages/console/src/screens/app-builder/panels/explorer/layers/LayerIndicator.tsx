import type { FunctionComponent, ReactElement } from "react";

import { Indicator, useEditor } from "@craftjs/core";

export interface IProps {
    placeholder: Indicator;
    suggestedStyles: any;
}

export const LayerIndicator: FunctionComponent<IProps> = (
    props: IProps,
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
            }}></div>
    );
};
