import type { FunctionComponent, ReactElement } from "react";

export interface IImageProps {
    id?: string;
    source?: string;
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
}

const Image: FunctionComponent<IImageProps> = (
    props: IImageProps,
): ReactElement => {
    const {
        id,
        source,
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
    } = props;
    return (
        <img
            src={source}
            style={{
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
            }}
        />
    );
};

export default Image;
