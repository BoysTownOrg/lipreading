#!/bin/bash

set -eu

VERSION=$1
MESSAGE=$2
./build.sh out
git tag -a "${VERSION}" -m "${MESSAGE}"
echo "${VERSION}" >out/version
