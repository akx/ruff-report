import rawRules from "./gen/rules.json";
import rawRuffVersion from "./gen/ruff-version.json";
import packageJson from "../package.json";
import { RuleExplanation } from "./types/ruff";

const appVersion = packageJson.version;
const ruffVersion = (rawRuffVersion as { version: string }).version;
const rules = rawRules as RuleExplanation[];
const ruleMap = Object.fromEntries(rules.map((r) => [r.code, r]));

export { rules, ruleMap, ruffVersion, appVersion };
