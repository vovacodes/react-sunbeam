DEFAULT_GOAL: build

clean:
	rm -rf dist

build: clean
	yarn tsc

dev:
	yarn concurrently -n tsc,srv -c cyan,magenta \
	 	'tsc --watch --preserveWatchOutput' \
		'deno run --allow-net --allow-read https://deno.land/x/denoliver@2.1.0/mod.ts .. -p 3333 --entry /demo/index.html'

lint:
	yarn eslint src --ext .ts,.tsx

type-check:
	yarn tsc --noEmit

PHONY: build dev lint type-check
