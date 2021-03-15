DEFAULT_GOAL: build

clean:
	rm -rf dist

build: clean
	yarn tsc

dev:
	yarn tsc --watch --preserveWatchOutput

type-check:
	yarn tsc --noEmit

lint:
	yarn eslint src --ext .ts,.tsx

test:
	yarn jest

PHONY: clean build dev lint type-check test
