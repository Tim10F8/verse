#!/bin/bash
# Build and package Verse for Kodi addon release
set -e

VERSION=${1:-"0.0.0"}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
RELEASE_DIR="$PROJECT_DIR/release"
ADDON_NAME="webinterface.verse"

echo "Building Verse v$VERSION..."

# Clean previous builds
rm -rf "$RELEASE_DIR"
mkdir -p "$RELEASE_DIR/$ADDON_NAME"

# Build production (no sourcemaps)
cd "$PROJECT_DIR"
npm run build

# Copy only required files
cp "$PROJECT_DIR/dist/addon.xml" "$RELEASE_DIR/$ADDON_NAME/"
cp "$PROJECT_DIR/dist/index.html" "$RELEASE_DIR/$ADDON_NAME/"
mkdir -p "$RELEASE_DIR/$ADDON_NAME/assets"

# Copy JS and CSS (exclude sourcemaps and devtools)
for file in "$PROJECT_DIR/dist/assets"/*; do
  filename=$(basename "$file")
  # Skip .map files and DevTools
  if [[ ! "$filename" == *.map ]] && [[ ! "$filename" == *DevTools* ]]; then
    cp "$file" "$RELEASE_DIR/$ADDON_NAME/assets/"
  fi
done

# Create zip
cd "$RELEASE_DIR"
zip -r "$ADDON_NAME-$VERSION.zip" "$ADDON_NAME"

# Show results
echo ""
echo "=== Release created ==="
echo "Location: $RELEASE_DIR/$ADDON_NAME-$VERSION.zip"
echo ""
echo "Contents:"
unzip -l "$ADDON_NAME-$VERSION.zip"
echo ""
echo "Size: $(du -h "$ADDON_NAME-$VERSION.zip" | cut -f1)"
