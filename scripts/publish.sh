#!/bin/bash

set -e

echo "Running build script..."

./scripts/build.sh

#if [ -z "$(git status --porcelain)" ]; then
#else
  git add .
  git commit -m "Publishing new version"
  npm version patch -m "%s"
  git push
#fi

echo "Publishing..."
npm publish
