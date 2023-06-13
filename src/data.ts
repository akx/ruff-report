import rawRules from "./gen/rules.json";
import { RuleExplanation } from "./types/ruff";

const rules = rawRules as RuleExplanation[];
const ruleMap = Object.fromEntries(rules.map((r) => [r.code, r]));

export { rules, ruleMap };
