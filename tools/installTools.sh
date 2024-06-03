#!/bin/bash

# Install nmap
sudo apt-get update
sudo apt-get install -y nmap

# Install httpx
GO111MODULE=on go get -v github.com/projectdiscovery/httpx/cmd/httpx
sudo cp ~/go/bin/httpx /usr/local/bin/

# Install nuclei
GO111MODULE=on go get -v github.com/projectdiscovery/nuclei/v2/cmd/nuclei
sudo cp ~/go/bin/nuclei /usr/local/bin/
