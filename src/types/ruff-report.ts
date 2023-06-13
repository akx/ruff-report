import { Message } from "./ruff";

export interface ExtendedMessage extends Message {
  codeClass: string;
  shortFilename: string;
  fixable: string;
  packageName: string;
  moduleName: string;
}

export const filterableKeys = [
  "code",
  "codeClass",
  "fixable",
  "packageName",
  "moduleName",
] as const;
export type FilterableKey = (typeof filterableKeys)[number];
export type ValuesKey = keyof ExtendedMessage & FilterableKey;
export const filterableKeyLabels: Record<ValuesKey, string> = {
  code: "Code",
  codeClass: "Code Class",
  fixable: "Fixability",
  packageName: "Package Name",
  moduleName: "Module Name",
};

export interface ProcessedMessages {
  messages: readonly ExtendedMessage[];
  values: {
    [k in ValuesKey]: Array<[string, number]>;
  };
}
