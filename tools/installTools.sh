#!/bin/bash

# Change directory to the repository root
cd "$(dirname "$0")"

# Initialize a Go module
go mod init internalNetworkScan

# Install nmap
sudo apt-get update
sudo apt-get install -y nmap

# Install httpx
GO111MODULE=on go install github.com/projectdiscovery/httpx/cmd/httpx@latest
sudo cp ~/go/bin/httpx /usr/local/bin/

# Install nuclei
GO111MODULE=on go install github.com/projectdiscovery/nuclei/v2/cmd/nuclei@latest
sudo cp ~/go/bin/nuclei /usr/local/bin/
