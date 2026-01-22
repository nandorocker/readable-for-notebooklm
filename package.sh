#!/bin/bash

# Configuration
VERSION=$(grep '"version":' extension/manifest.json | head -1 | awk -F '"' '{print $4}')
NAME="readable-for-notebooklm"
DIST_DIR="dist"
ZIP_NAME="${NAME}-v${VERSION}.zip"

echo "📦 Packaging ${NAME} v${VERSION}..."

# Create dist directory if it doesn't exist
mkdir -p "$DIST_DIR"

# --- Chrome / General ZIP ---
echo "🤐 Creating Chrome ZIP..."
# Clean up any existing zip in dist
rm -f "${DIST_DIR}/${ZIP_NAME}"

cd extension
zip -r "../${DIST_DIR}/${ZIP_NAME}" . -x "*.DS_Store" "__MACOSX/*" "*.git*" "node_modules/*"
cd ..

# --- Firefox SIGNING ---
# Note: Requires web-ext (npm install --global web-ext)
# Note: Requires AMO_JWT_ISSUER and AMO_JWT_SECRET env vars
if command -v web-ext &> /dev/null; then
    if [ -n "$AMO_JWT_ISSUER" ] && [ -n "$AMO_JWT_SECRET" ]; then
        echo "🦊 Signing Firefox XPI..."
        web-ext sign \
            --source-dir extension \
            --artifacts-dir "$DIST_DIR" \
            --api-key "$AMO_JWT_ISSUER" \
            --api-secret "$AMO_JWT_SECRET" \
            --channel unlisted
    else
        echo "⚠️ Skipping Firefox signing: AMO_JWT_ISSUER and AMO_JWT_SECRET environment variables are not set."
        echo "   Get your API keys at: https://addons.mozilla.org/en-US/developers/addon/api/key/"
    fi
else
    echo "⚠️ Skipping Firefox signing: 'web-ext' is not installed."
    echo "   Install it with: npm install --global web-ext"
fi

echo "✅ Done! Outputs are in /${DIST_DIR}"
