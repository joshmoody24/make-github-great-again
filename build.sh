#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

VERSION=$(grep '"version"' manifest.json | sed 's/.*: "\(.*\)".*/\1/')
OUTPUT_FILE="make-github-great-again-v${VERSION}.zip"

rm -f "$OUTPUT_FILE"

zip "$OUTPUT_FILE" \
  manifest.json \
  content.js \
  popup.html \
  popup.js \
  icon-128.png

echo "Created $OUTPUT_FILE"
