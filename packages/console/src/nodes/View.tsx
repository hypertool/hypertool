import type { FunctionComponent, ReactElement } from "react";

export interface IProps {
    id?: string;
    backgroundColor?: string;
    width?: string;
    height?: string;
    minWidth?: string;
    minHeight?: string;
    maxWidth?: string;
    maxHeight?: string;
    marginTop?: string;
    marginRight?: string;
    marginBottom?: string;
    marginLeft?: string;
    paddingTop?: string;
    paddingRight?: string;
    paddingBottom?: string;
    paddingLeft?: string;
    flexDirection?: string;
    flexWrap?: string;
    flexMainAxisAlignment?: string;
    flexCrossAxisAlignment?: string;
    flexGap?: string;
    flexColumnGap?: string;
    flexRowGap?: string;
    children?: ReactElement;
}

const View: FunctionComponent<IProps> = (props: IProps): ReactElement => {
    const {
        backgroundColor,
        width,
        height,
        minWidth,
        minHeight,
        maxWidth,
        maxHeight,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        flexDirection,
        flexWrap,
        flexMainAxisAlignment,
        flexCrossAxisAlignment,
        flexGap,
        flexColumnGap,
        children,
    } = props as any;
    return (
        <div
            style={{
                backgroundColor,
                width,
                height,
                minWidth,
                minHeight,
                maxWidth,
                maxHeight,
                marginTop,
                marginRight,
                marginBottom,
                marginLeft,
                paddingTop,
                paddingRight,
                paddingBottom,
                paddingLeft,
                display: "flex",
                flexDirection,
                flexWrap,
                justifyContent: flexMainAxisAlignment ?? undefined,
                alignItems: flexCrossAxisAlignment ?? undefined,
                gap: flexGap ?? undefined,
                columnGap: flexColumnGap ?? undefined,
            }}
        >
            {children}
        </div>
    );
};

export default View;
