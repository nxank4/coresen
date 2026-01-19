#!/bin/bash
# Script to check if lockfile is in sync with package.json

set -e

echo "🔍 Checking if bun.lock is in sync with package.json..."

if ! bun install --frozen-lockfile > /dev/null 2>&1; then
  echo "❌ ERROR: bun.lock is out of sync with package.json"
  echo "📦 Run 'bun install' to update the lockfile"
  exit 1
fi

echo "✅ Lockfile is in sync!"
exit 0
