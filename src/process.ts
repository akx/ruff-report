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
import { countBy, groupBy, orderByDesc } from "./nodash";

export function extendMessages(
  messages: readonly Message[],
): ExtendedMessage[] {
  const extendedMessages: ExtendedMessage[] = [];
  const filenames = new Set<string>(
    messages.map((message) => message.filename),
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
  iteratee: keyof ExtendedMessage | ((m: ExtendedMessage) => string),
) {
  return orderByDesc(Object.entries(countBy(extendedMessages, iteratee)), 1);
}

export function groupAndSort(
  extendedMessages: readonly ExtendedMessage[],
  iteratee: keyof ExtendedMessage | ((m: ExtendedMessage) => string),
) {
  return orderByDesc(
    Object.entries(groupBy(extendedMessages, iteratee)),
    (pair) => pair[1].length,
  );
}

export function processMessages(
  messages: readonly Message[],
): ProcessedMessages {
  const extendedMessages = extendMessages(messages);
  const values = Object.fromEntries(
    filterableKeys.map((prop) => [
      prop,
      countAndSort(extendedMessages, (m) => m[prop]),
    ]),
  ) as ProcessedMessages["values"];
  return {
    messages: extendedMessages,
    values: values,
  };
}
