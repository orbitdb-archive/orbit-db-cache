all: build

deps:
	npm install

test: deps
	npm run test
	rm -f dump.rdb
	rm -f orbitdb.json
	
build: test
	npm run build
	@echo "Build success!"
	@echo "Output: 'dist/'"

clean:
	rm -rf orbitdb/
	rm -rf customDir/
	rm -rf node_modules/
	rm -rf redis-stable/

clean-dependencies: clean
	rm -f package-lock.json;

rebuild: | clean-dependencies build

.PHONY: test build
