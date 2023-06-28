.PHONY: src/gen/rules.json

src/gen/rules.json:
	ruff rule --all --format=json > $@