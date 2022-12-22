#!/bin/bash

set -e

echo "Running build script..."

./scripts/build.sh

echo "Publishing..."
npm version patch
npm publish
