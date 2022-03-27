export interface IScreen {
    id: string;
    app: IApp;
    name: string;
    title: string;
    description: string;
    slug: string;
    content: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IApp {
    id: string;
    name: string;
    title: string;
    slug: string;
    description: string;
    screens: IScreen[];
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export type TAppContext = IApp;