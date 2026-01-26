#!/usr/bin/env node

/**
 * Performance Analysis Script
 * Analyzes bundle output and provides recommendations
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

function analyzePerformance() {
  console.log("📊 Performance Analysis Report\n");
  console.log("=" .repeat(60));

  // Analyze static chunks
  const staticDir = path.join(BUILD_DIR, "static", "chunks");
  if (fs.existsSync(staticDir)) {
    console.log("\n🔴 CRITICAL ISSUES - Large JavaScript Bundles:\n");
    analyzeLargeChunks(staticDir);
  }

  // Analyze HTML files
  const serverDir = path.join(BUILD_DIR, "server", "app");
  if (fs.existsSync(serverDir)) {
    console.log("\n⚠️  WARNING - Large HTML Files:\n");
    analyzeHTMLFiles(serverDir);
  }

  // Analyze dependencies
  console.log("\n📦 Dependency Analysis:\n");
  analyzeDependencies();

  // Recommendations
  console.log("\n💡 RECOMMENDATIONS:\n");
  printRecommendations();
}

function analyzeLargeChunks(dir) {
  const chunks = [];
  
  function walk(currentPath) {
    const items = fs.readdirSync(currentPath);
    items.forEach((item) => {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (item.endsWith(".js") && !item.endsWith(".map")) {
        chunks.push({ path: fullPath, size: stat.size, name: item });
      }
    });
  }

  walk(dir);
  
  chunks.sort((a, b) => b.size - a.size);
  
  const largeChunks = chunks.filter(c => c.size > 200 * 1024); // > 200KB
  
  if (largeChunks.length === 0) {
    console.log("✅ No large chunks found (all < 200KB)");
    return;
  }

  largeChunks.slice(0, 10).forEach((chunk, index) => {
    const sizeKB = chunk.size / 1024;
    const status = sizeKB > 500 ? "🔴" : sizeKB > 300 ? "🟡" : "🟢";
    console.log(`${status} ${chunk.name}: ${formatBytes(chunk.size)}`);
    
    // Try to identify what's in the chunk
    if (chunk.name.includes("antd")) {
      console.log("   └─ Contains: Ant Design");
    } else if (chunk.name.includes("three")) {
      console.log("   └─ Contains: Three.js");
    } else if (chunk.name.includes("react-icons")) {
      console.log("   └─ Contains: React Icons");
    } else if (chunk.name.includes("katex")) {
      console.log("   └─ Contains: KaTeX (Math rendering)");
    } else if (chunk.name.includes("highlight")) {
      console.log("   └─ Contains: Syntax Highlighting");
    }
  });

  const totalSize = largeChunks.reduce((sum, c) => sum + c.size, 0);
  console.log(`\n   Total size of large chunks: ${formatBytes(totalSize)}`);
  console.log(`   Average chunk size: ${formatBytes(totalSize / largeChunks.length)}`);
}

function analyzeHTMLFiles(dir) {
  const htmlFiles = [];
  
  function walk(currentPath) {
    const items = fs.readdirSync(currentPath);
    items.forEach((item) => {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (item.endsWith(".html")) {
        htmlFiles.push({ path: fullPath, size: stat.size, name: item });
      }
    });
  }

  walk(dir);
  
  htmlFiles.sort((a, b) => b.size - a.size);
  
  const largeHTML = htmlFiles.filter(f => f.size > 500 * 1024); // > 500KB
  
  if (largeHTML.length === 0) {
    console.log("✅ No large HTML files found");
    return;
  }

  largeHTML.forEach((file) => {
    const sizeKB = file.size / 1024;
    const status = sizeKB > 2000 ? "🔴" : sizeKB > 1000 ? "🟡" : "🟢";
    console.log(`${status} ${file.name}: ${formatBytes(file.size)}`);
  });
}

function analyzeDependencies() {
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const heavyDeps = {
    "three": "3D library - consider lazy loading",
    "@react-three/fiber": "React Three Fiber - consider lazy loading",
    "@react-three/drei": "React Three Drei - consider lazy loading",
    "antd": "Ant Design - large UI library, consider tree-shaking",
    "react-icons": "Large icon library - consider importing specific icons",
    "katex": "Math rendering - consider lazy loading",
    "highlight.js": "Syntax highlighting - consider lighter alternatives",
    "rehype-highlight": "Syntax highlighting - consider lighter alternatives",
  };

  console.log("Heavy dependencies detected:");
  Object.keys(heavyDeps).forEach(dep => {
    if (deps[dep]) {
      console.log(`  • ${dep}: ${heavyDeps[dep]}`);
    }
  });
}

function printRecommendations() {
  const recommendations = [
    {
      priority: "HIGH",
      issue: "JavaScript bundles > 500KB",
      solution: [
        "1. Implement code splitting with dynamic imports",
        "2. Lazy load heavy components (3D blob, syntax highlighting)",
        "3. Use Next.js automatic code splitting",
        "4. Consider removing unused dependencies"
      ]
    },
    {
      priority: "HIGH",
      issue: "HTML files > 1MB",
      solution: [
        "1. Check for inline styles or scripts in HTML",
        "2. Ensure proper code splitting",
        "3. Use Next.js Image optimization",
        "4. Minimize initial HTML payload"
      ]
    },
    {
      priority: "MEDIUM",
      issue: "Large dependencies (Three.js, Ant Design, React Icons)",
      solution: [
        "1. Lazy load Three.js components (MorphingBlob3D)",
        "2. Tree-shake Ant Design (import only needed components)",
        "3. Import specific icons instead of entire react-icons library",
        "4. Consider lighter alternatives for syntax highlighting"
      ]
    },
    {
      priority: "MEDIUM",
      issue: "Multiple large chunks",
      solution: [
        "1. Analyze bundle composition with @next/bundle-analyzer",
        "2. Identify duplicate dependencies",
        "3. Use webpack-bundle-analyzer to visualize",
        "4. Consider using SWC minification"
      ]
    },
    {
      priority: "LOW",
      issue: "Development cache files",
      solution: [
        "1. These are normal in development",
        "2. Clear .next/cache if needed: rm -rf .next/cache",
        "3. Production builds are optimized automatically"
      ]
    }
  ];

  recommendations.forEach((rec, index) => {
    const icon = rec.priority === "HIGH" ? "🔴" : rec.priority === "MEDIUM" ? "🟡" : "🟢";
    console.log(`${icon} [${rec.priority}] ${rec.issue}`);
    rec.solution.forEach(sol => console.log(`   ${sol}`));
    if (index < recommendations.length - 1) console.log("");
  });
}

analyzePerformance();
