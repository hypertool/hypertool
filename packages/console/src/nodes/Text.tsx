import { useNode } from "@craftjs/core";

export const Text = ({ text }: any) => {
    const {
        connectors: { connect, drag },
    } = useNode();

    return (
        <div ref={(ref) => connect(drag(ref as any))}>
            <p>{text}</p>
        </div>
    );
};
