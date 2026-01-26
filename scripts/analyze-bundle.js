#!/usr/bin/env node

/**
 * Bundle Analyzer Script
 * Analyzes Next.js build output to identify large dependencies
 * 
 * Usage: bun run analyze-bundle
 */

const fs = require("fs");
const path = require("path");

const BUILD_DIR = path.join(process.cwd(), ".next");

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

function analyzeBuild() {
  console.log("🔍 Analyzing Next.js build...\n");

  // Check if build exists
  if (!fs.existsSync(BUILD_DIR)) {
    console.error("❌ Build directory not found. Please run 'bun run build' first.");
    process.exit(1);
  }

  // Analyze static files
  const staticDir = path.join(BUILD_DIR, "static");
  if (fs.existsSync(staticDir)) {
    console.log("📦 Static Assets:");
    analyzeDirectory(staticDir, "");
  }

  // Analyze server chunks
  const serverDir = path.join(BUILD_DIR, "server");
  if (fs.existsSync(serverDir)) {
    console.log("\n🖥️  Server Chunks:");
    analyzeDirectory(serverDir, "");
  }

  // Check for large files
  console.log("\n⚠️  Large Files (>100KB):");
  findLargeFiles(BUILD_DIR, 100 * 1024);
}

function analyzeDirectory(dir, prefix = "") {
  const items = fs.readdirSync(dir);
  const files = [];
  const dirs = [];

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      dirs.push({ name: item, path: fullPath });
    } else {
      files.push({ name: item, size: stat.size, path: fullPath });
    }
  });

  // Sort files by size
  files.sort((a, b) => b.size - a.size);

  // Show top 10 largest files
  files.slice(0, 10).forEach((file) => {
    console.log(`  ${prefix}${file.name}: ${formatBytes(file.size)}`);
  });

  // Recursively analyze subdirectories
  dirs.forEach((dir) => {
    analyzeDirectory(dir.path, prefix + dir.name + "/");
  });
}

function findLargeFiles(dir, minSize) {
  const results = [];

  function walk(currentPath) {
    const items = fs.readdirSync(currentPath);

    items.forEach((item) => {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (stat.size > minSize) {
        results.push({
          path: fullPath.replace(process.cwd() + "/", ""),
          size: stat.size,
        });
      }
    });
  }

  walk(dir);

  results.sort((a, b) => b.size - a.size);
  results.forEach((file) => {
    console.log(`  ${file.path}: ${formatBytes(file.size)}`);
  });
}

analyzeBuild();
