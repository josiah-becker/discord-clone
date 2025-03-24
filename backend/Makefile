.DEFAULT_GOAL := build

.PHONY:fmt vet build
fmt:
	go fmt ./...

vet:
	go vet ./...

clean:
	go clean
	rm -f ./discord-server

build: fmt vet
	go build