DEFAULT_GOAL: build

clean:
	rm -rf dist

build: clean
	yarn tsc

dev:
	yarn tsc --watch --preserveWatchOutput

type-check:
	yarn tsc --noEmit

test:
	yarn jest

PHONY: clean build dev type-check test
