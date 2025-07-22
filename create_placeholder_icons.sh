#!/bin/bash

# Create simple 1x1 pixel PNG files for each required icon size
# This is a temporary solution to fix the 404 errors

cd /workspaces/Ship_fix/public

# Base64 encoded 1x1 transparent PNG
PNG_DATA="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

# Create icon files for all required sizes
for size in 72 96 128 144 152 192 384 512; do
    echo "Creating icon-${size}.png..."
    echo $PNG_DATA | base64 -d > "icon-${size}.png"
done

echo "Created placeholder PNG icons to fix 404 errors"
echo "These are 1x1 pixel placeholders - replace with proper icons later"
