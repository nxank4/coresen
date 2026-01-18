#!/bin/bash
# Script to check if lockfile is in sync with package.json

set -e

echo "🔍 Checking if pnpm-lock.yaml is in sync with package.json..."

if ! pnpm install --frozen-lockfile --dry-run > /dev/null 2>&1; then
  echo "❌ ERROR: pnpm-lock.yaml is out of sync with package.json"
  echo "📦 Run 'pnpm install' to update the lockfile"
  exit 1
fi

echo "✅ Lockfile is in sync!"
exit 0
