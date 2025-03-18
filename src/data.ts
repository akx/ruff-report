import rawRuffVersion from "./gen/ruff-version.json";
import packageJson from "../package.json";
import { RuleExplanation } from "./types/ruff";

const appVersion = packageJson.version;
const ruffVersion = (rawRuffVersion as { version: string }).version;
let ruleMap: Record<string, RuleExplanation> = {};

export async function loadRuleMap() {
  const mod = await import("./gen/rules.json");
  const rawRules = mod.default;
  const rules = rawRules as RuleExplanation[];
  ruleMap = Object.fromEntries(rules.map((r) => [r.code, r]));
}

export function getRuleMap() {
  return ruleMap;
}

export { ruffVersion, appVersion };
