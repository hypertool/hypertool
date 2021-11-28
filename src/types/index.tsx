import { resourceTypes } from "../utils/constants";

export type ResourceType = typeof resourceTypes[number];

export interface Resource {
  type: ResourceType;
  title: string;
  imageURL: string;
}
