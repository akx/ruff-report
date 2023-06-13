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
  return filename.replace(/\.py$/, "").replace(/\//g, ".");
}

export function derivePackage(module: string) {
  return module.replaceAll(".__init__", ".").replace(/\.[^.]+$/, "");
}
