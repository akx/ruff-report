all: src/gen/rules.json src/gen/ruff-version.json

.PHONY: src/gen/rules.json

src/gen/rules.json:
	ruff rule --all --format=json > $@

.PHONY: src/gen/ruff-version.json

src/gen/ruff-version.json:
	ruff --version | jq -R '{"version":.}' > $@

.PHONY: standalone

standalone:
	env VITE_RR_STANDALONE=1 pnpm build
	mv dist-standalone/index.html ./ruff-report-standalone.html
