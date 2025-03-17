import { Message } from "./types/ruff";

export function getCommonPrefix(values: readonly string[]) {
  let prefix = "";
  for (const value of values) {
    if (prefix === "") {
      prefix = value;
      continue;
    }
    let i = 0;
    while (i < prefix.length && i < value.length && prefix[i] === value[i]) {
      i++;
    }
    prefix = prefix.slice(0, i);
  }
  return prefix;
}

export function removePrefix(value: string, prefix: string) {
  if (prefix && value && value.startsWith(prefix)) {
    return value.slice(prefix.length);
  }
  return value;
}

export function deriveModule(filename: string) {
  return filename.replace(/\.py$/, "").replaceAll('/', ".");
}

export function derivePackage(module: string) {
  return module.replaceAll(".__init__", ".").replace(/\.[^.]+$/, "");
}

export function validateDataAsRuffData(data: unknown): data is Message[] {
  if (!data) return false;
  if (!Array.isArray(data)) return false;
  // TODO: improve validation
  return data.every((m) => m.code);
}

export function parseRawJSONAsRuffData(
  rawData: string | ArrayBuffer,
): Message[] | null {
  if (typeof rawData !== "string") {
    rawData = new TextDecoder("utf-8").decode(rawData);
  }
  const data = JSON.parse(rawData);
  if (validateDataAsRuffData(data)) {
    return data;
  }
  return null;
}
