DEFAULT_GOAL: build

clean:
	make -C packages/demo $@
	make -C packages/react-sunbeam $@

build: clean
	make -C packages/react-sunbeam $@
	make -C packages/demo $@

dev: build
	yarn concurrently -n sunb,demo -c red,blue \
	"make -C packages/react-sunbeam ${@}" \
	"make -C packages/demo ${@}"

lint:
	make -C packages/react-sunbeam $@
	make -C packages/demo $@

type-check:
	make -C packages/react-sunbeam $@
	make -C packages/demo $@

test:
	make -C packages/react-sunbeam $@

PHONY: clean build dev type-check test
