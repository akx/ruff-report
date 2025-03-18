import json
import sys

rules_out = []
for rule in json.load(sys.stdin):
    del rule["message_formats"]
    del rule["summary"]
    del rule["linter"]
    if not rule["preview"]:
        del rule["preview"]
    fix = rule.pop("fix")
    if fix == "Fix is not available.":
        pass # No fix, don't keep rule in
    elif fix == "Fix is sometimes available.":
        rule["fix"] = 1
    elif fix == "Fix is always available.":
        rule["fix"] = 2
    else:
        raise Exception(f"Unexpected fix: {fix}")
    rules_out.append(rule)

print(json.dumps(rules_out, indent=2))
