.DEFAULT_GOAL := build

.PHONY:fmt vet build
fmt:
	go fmt ./...

vet:
	go vet ./...

clean:
	go clean
	rm -f ./hello_world

build: fmt vet
	go build