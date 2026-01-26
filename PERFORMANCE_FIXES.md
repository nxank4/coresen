# 🚀 Performance Fixes - Action Plan

## 📋 Summary

Từ phân tích bundle, đã xác định các vấn đề chính:

1. **🔴 CRITICAL:** 2 JavaScript chunks > 500KB (tổng ~2MB)
2. **🔴 CRITICAL:** HTML files > 1MB (lớn nhất 2.6MB)
3. **🟡 WARNING:** Heavy dependencies (Three.js, Ant Design, React Icons)

## ✅ Immediate Actions (Quick Wins)

### 1. Remove Sugar-high (Client-side Highlighting)

**Why:** Đang dùng cả `sugar-high` (client) và `rehype-highlight` (server). Chỉ cần server-side.

**Action:**
```bash
bun remove sugar-high
```

**Files to update:**
- `app/components/ui/mdx.tsx`: Remove sugar-high import and logic
- Keep only `rehype-highlight` for server-side highlighting

**Expected savings:** ~50-100KB

### 2. Verify React Icons Usage

**Current:** Using `react-icons/fa6` and `react-icons/tb` (subpath imports - good!)

**Files using react-icons:**
- `app/components/layout/footer.tsx`
- `app/profile/page.tsx`
- `app/components/ui/theme-switch.tsx`

**Options:**
1. **Keep as-is** (subpath imports are already optimized)
2. **Migrate to lucide-react** (smaller, tree-shakeable)

**Recommendation:** Keep as-is for now, but consider migrating to lucide-react later.

**Expected savings:** Minimal (already optimized with subpath imports)

### 3. Optimize KaTeX CSS Loading

**Current:** KaTeX CSS loaded globally

**Action:** Load KaTeX CSS only when math content exists

**Files to update:**
- `app/components/ui/mdx.tsx`: Conditional CSS import

**Expected savings:** ~60KB (KaTeX CSS)

## 🔧 Medium Priority Fixes

### 4. Verify MorphingBlob3D Lazy Loading

**Current:** Already using `dynamic()` import ✅

**Action:** Verify it's not in initial bundle:
1. Run bundle analyzer
2. Check if Three.js is in initial chunks
3. If yes, investigate why dynamic import isn't working

**Expected savings:** ~1.5MB (Three.js + React Three Fiber)

### 5. Optimize Ant Design Imports

**Current:** Importing from `antd`

**Action:** Verify tree-shaking is working:
1. Check bundle analyzer for unused Ant Design components
2. Consider using `antd/es` imports if needed
3. Remove unused Ant Design components

**Expected savings:** ~500KB-1MB

### 6. Analyze HTML Size

**Action:** Inspect large HTML files:
```bash
# Check blog.html content
head -200 .next/server/app/blog.html | less

# Look for:
# - Large inline styles
# - Large inline scripts  
# - Duplicate content
# - Unoptimized images
```

**Possible fixes:**
- Remove inline styles (move to CSS)
- Optimize MDX content rendering
- Ensure proper code splitting

**Expected savings:** ~1-2MB per HTML file

## 📊 Monitoring & Verification

### After Each Fix:

1. **Build and analyze:**
   ```bash
   bun run build
   bun run analyze-bundle
   ```

2. **Check bundle sizes:**
   - Initial JS chunks should be < 500KB
   - HTML files should be < 500KB

3. **Test performance:**
   ```bash
   bun run dev
   # Open Performance Monitor (Ctrl+Shift+P)
   # Check Web Vitals in console
   ```

4. **Run Lighthouse:**
   - Open Chrome DevTools
   - Run Lighthouse audit
   - Target: Performance score > 90

## 🎯 Target Metrics

After all fixes:

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Initial JS Bundle | ~2MB | <500KB | 🔴 |
| HTML Size | 2.6MB | <500KB | 🔴 |
| LCP | ? | <2.5s | ⚪ |
| FCP | ? | <1.8s | ⚪ |
| TTI | ? | <3.8s | ⚪ |
| CLS | ? | <0.1 | ⚪ |

## 📝 Implementation Order

1. ✅ **Remove sugar-high** (5 min) - Quick win
2. ✅ **Optimize KaTeX CSS** (10 min) - Quick win  
3. ⏳ **Verify MorphingBlob3D lazy loading** (15 min) - Critical
4. ⏳ **Analyze HTML content** (20 min) - Critical
5. ⏳ **Optimize Ant Design** (30 min) - Medium
6. ⏳ **Install bundle analyzer** (10 min) - Monitoring

## 🔗 Related Files

- `PERFORMANCE.md` - Performance monitoring guide
- `PERFORMANCE_ANALYSIS.md` - Detailed analysis
- `scripts/analyze-bundle.js` - Bundle analysis script
- `scripts/analyze-performance.js` - Performance analysis script
