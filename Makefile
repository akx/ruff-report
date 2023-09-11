all: src/gen/rules.json src/gen/ruff-version.json

.PHONY: src/gen/rules.json

src/gen/rules.json:
	ruff rule --all --format=json > $@

.PHONY: src/gen/ruff-version.json

src/gen/ruff-version.json:
	ruff --version | jq -R '{"version":.}' > $@
