import packageJson from "../package.json";

export const standalone = !!import.meta.env.VITE_RR_STANDALONE;
export const appVersion = String(
  import.meta.env.VITE_RR_VERSION || packageJson.version,
);
