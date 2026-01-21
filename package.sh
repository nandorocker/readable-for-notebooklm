#!/bin/bash

# Configuration
VERSION=$(grep '"version":' extension/manifest.json | head -1 | awk -F '"' '{print $4}')
NAME="readable-for-notebooklm"
DIST_DIR="dist"
ZIP_NAME="${NAME}-v${VERSION}.zip"

echo "📦 Packaging ${NAME} v${VERSION} to /${DIST_DIR}..."

# Create dist directory if it doesn't exist
mkdir -p "$DIST_DIR"

# Clean up any existing zip in dist
rm -f "${DIST_DIR}/${ZIP_NAME}"

# Create temporary build directory (optional but cleaner)
# Here we just zip directly from the extension folder
# but we use 'junk paths' logic or cd to avoid folder nesting
cd extension
zip -r "../${DIST_DIR}/${ZIP_NAME}" . -x "*.DS_Store" "__MACOSX/*" "*.git*" "node_modules/*"

cd ..

echo "✅ Done! Created ${DIST_DIR}/${ZIP_NAME}"
