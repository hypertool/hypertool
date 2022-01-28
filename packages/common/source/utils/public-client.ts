export default class PublicClient<T> {
    app_identifier: string;

    constructor(app_identifier: string) {
        this.app_identifier = app_identifier;
    }
}
