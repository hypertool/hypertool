export interface Query {
    name: string;
    description: string;
    resource: string;
    content: string;
}

export interface Resource {
    name: string;
    type: string;
    connection: string;
}

export interface App {
    name: string;
    slug: string;
    title: string;
    description: string;
    groups: string[];
}

export interface Manifest {
    queries: Query[];
    resources: Resource[];
    app: App;
    file?: string;
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    description: string;
    organization: string;
    gender: string;
    countryCode: string;
    pictureURL: string;
    emailAddress: string;
    emailVerified: boolean;
    groups: string[];
    role: string;
    birthday: Date;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Session {
    jwtToken: string;
    user: User;
    createdAt: Date;
}
