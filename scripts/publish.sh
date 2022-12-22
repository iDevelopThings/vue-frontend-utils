#!/bin/bash

set -e

echo "Running build script..."

./scripts/build.sh

echo "Publishing..."
npm version patch --dry-run
npm publish --dry-run
