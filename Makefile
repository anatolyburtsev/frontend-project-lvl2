install: install-deps

install-deps:
	npm ci

test:
	npm test

lint:
	npx eslint .

lint-fix:
	npx eslint --fix .

publish:
	npm publish --dry-run

link:
	npm link

unlink:
	npm unlink

.PHONY: test
