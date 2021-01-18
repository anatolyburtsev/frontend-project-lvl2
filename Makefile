install: install-deps

install-deps:
	npm ci

test:
	npx -n --experimental-vm-modules jest

test-coverage:
	npm test -- --coverage --coverageProvider=v8

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
