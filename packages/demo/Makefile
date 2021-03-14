DEFAULT_GOAL: build

build:
	yarn tsc

dev:
	yarn concurrently -n tsc,srv -c cyan,magenta \
	 	'tsc --watch --preserveWatchOutput' \
		'deno run --allow-net --allow-read https://deno.land/x/denoliver@2.1.0/mod.ts .. -p 3333 --entry /demo/index.html'

type-check:
	yarn tsc --noEmit

PHONY: build dev type-check
