type DeprecationPayload = Partial<{
    suggest: string;
    doc: string;
}>;

export const deprecationWarning = (name: any, payload?: DeprecationPayload) => {
    let message = `Deprecation warning: ${name} will be deprecated in future relases.`;

    const { suggest, doc } = payload as any;

    if (suggest) {
        message += ` Please use ${suggest} instead.`;
    }

    // URL link to Documentation
    if (doc) {
        message += `(${doc})`;
    }

    // eslint-disable-next-line no-console
    console.warn(message);
};
