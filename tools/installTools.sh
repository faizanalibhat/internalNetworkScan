#!/bin/bash

cd "$(dirname "$0")"

go mod init internalNetworkScan

sudo apt-get update
sudo apt-get install -y nmap

