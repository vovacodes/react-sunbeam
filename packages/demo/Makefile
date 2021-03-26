DEFAULT_GOAL: build

clean:
	rm -rf dist

build: clean
	yarn tsc

dev:
	make --jobs=2 watch serve

watch:
	yarn tsc --watch --preserveWatchOutput

serve:
	deno run --allow-net --allow-read https://deno.land/x/denoliver@2.1.0/mod.ts .. -p 3333 -n --entry /demo/index.html

lint:
	yarn eslint src --ext .ts,.tsx

type-check:
	yarn tsc --noEmit

PHONY: build dev watch serve lint type-check
