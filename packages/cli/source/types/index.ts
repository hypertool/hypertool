export interface Query {
    id?: string;
    name: string;
    description: string;
    resource: string;
    content: string;
}

export interface Resource {
    id?: string;
    name: string;
    description: string;
    type: string;
    connection: string;
}

export interface App {
    id?: string;
    name: string;
    slug: string;
    description: string;
    title: string;
    groups: string[];
    resources?: string[];
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
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
