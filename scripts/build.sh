#!/bin/bash

set -e
# set -x

#CWD=$(pwd)
# Check if cwd ends with 'scripts'
#if [[ CWD =~ "scripts" ]]; then
#  echo "CWD ends with 'scripts'"
#  # If cwd ends with 'scripts', go up one level
#  cd ..
#fi

echo "Cleaning dist dir..."

rimraf dist
mkdir dist

echo "Building vue lib..."

vue-tsc -p ./tsconfig.lib.json
vite build --config ./vite.lib.config.js

echo "Building vite plugin..."
tsc -p ./tsconfig.plugin.json
vite build --config ./vite.plugin.config.js

echo "Copied package.json to dist"
cp ./package.json ./dist/package.json

exit 0;
