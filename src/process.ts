import {
  ExtendedMessage,
  filterableKeys,
  ProcessedMessages,
} from "./types/ruff-report";
import { Message } from "./types/ruff";
import {
  deriveModule,
  derivePackage,
  getCommonPrefix,
  removePrefix,
} from "./utils";
import { countBy, groupBy, orderBy } from "lodash";

export function extendMessages(
  messages: readonly Message[],
): ExtendedMessage[] {
  const extendedMessages: ExtendedMessage[] = [];
  const filenames = new Set<string>(
    messages.map((message) => message.filename)
  );
  const commonPrefix = getCommonPrefix([...filenames]);
  for (const message of messages) {
    const shortFilename = removePrefix(message.filename, commonPrefix);
    const moduleName = deriveModule(shortFilename);
    const packageName = derivePackage(moduleName);
    extendedMessages.push({
      ...message,
      codeClass: message.code.replace(/[0-9]+$/, ""),
      shortFilename,
      fixable: message.fix ? "Fixable" : "Not fixable",
      packageName,
      moduleName,
    });
  }
  return extendedMessages;
}

function countAndSort(
  extendedMessages: readonly ExtendedMessage[],
  iteratee: string | ((m: ExtendedMessage) => string),
) {
  return orderBy(
    Object.entries(countBy(extendedMessages, iteratee)),
    [1],
    ["desc"],
  );
}

export function groupAndSort(
  extendedMessages: readonly ExtendedMessage[],
  iteratee: string | ((m: ExtendedMessage) => string),
) {
  return orderBy(
    Object.entries(groupBy(extendedMessages, iteratee)),
    [(p) => p[1].length],
    ["desc"],
  );
}

export function processMessages(
  messages: readonly Message[],
): ProcessedMessages {
  const extendedMessages = extendMessages(messages);
  const values = Object.fromEntries(
    filterableKeys.map((prop) => {
      return [prop, countAndSort(extendedMessages, (m) => m[prop])];
    }),
  ) as ProcessedMessages["values"];
  return {
    messages: extendedMessages,
    values: values,
  };
}
