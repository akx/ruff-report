all: src/gen/rules.ts src/gen/ruff-version.json

.PHONY: src/gen/rules.ts

src/gen/rules.ts:
	ruff rule --all --output-format=json | python process_rules.py > $@

.PHONY: src/gen/ruff-version.json

src/gen/ruff-version.json:
	ruff version --output-format=json > $@

.PHONY: standalone

standalone:
	env VITE_RR_STANDALONE=1 pnpm build
	mv dist-standalone/index.html ./ruff-report-standalone.html
