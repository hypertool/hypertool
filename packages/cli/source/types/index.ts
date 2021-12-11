export interface Query {
    name: string;
    resource: string;
    content: string;
}

export interface Resource {
    name: string;
    type: string;
    connection: string;
}

export interface App {
    slug: string;
    title: string;
    description: string;
    groups: string[];
}

export interface Manifest {
    queries: Query[];
    resources: Resource[];
    app: App;
    file: string;
}
