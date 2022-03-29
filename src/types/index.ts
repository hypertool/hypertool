export interface IController {
  id: string;
  name: string;
  description: string;
  language: string;
  patched: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IScreen {
  id: string;
  app: IApp;
  name: string;
  title: string;
  description: string;
  slug: string;
  content: string;
  controller: IController;
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

export interface INode {
  id: string;
  children: INode[];
}

export interface ICraftNode {
  custom: {
    [key: string]: any;
  };
  nodes: string[];
  props: {
    [key: string]: any;
  };
  type: {
    resolvedName: string;
  };
  parent?: string;
}

export type TCraftNodeKey = keyof ICraftNode;
