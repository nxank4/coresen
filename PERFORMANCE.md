# Performance Monitoring Guide

Hướng dẫn trace và optimize performance cho ứng dụng Next.js.

## 🛠️ Công cụ đã được tích hợp

### 1. Vercel Analytics & Speed Insights
- **Vercel Analytics**: Track page views và user behavior
- **Speed Insights**: Monitor Core Web Vitals (LCP, FID, CLS, INP, TTFB)
- Xem dashboard tại: https://vercel.com/dashboard

### 2. Web Vitals Component
Component tự động log Web Vitals metrics:
- **CLS** (Cumulative Layout Shift)
- **FID** (First Input Delay)
- **FCP** (First Contentful Paint)
- **LCP** (Largest Contentful Paint)
- **TTFB** (Time to First Byte)
- **INP** (Interaction to Next Paint)

### 3. Performance Monitor
Component hiển thị real-time performance metrics trong development:
- **Toggle**: Nhấn `Ctrl+Shift+P` để bật/tắt
- Hiển thị: Load time, FCP, TTI, resource sizes
- Chỉ hoạt động trong development mode

## 📊 Cách sử dụng

### 1. Development Mode

#### Xem Performance Monitor
```bash
bun run dev
```
- Mở browser và nhấn `Ctrl+Shift+P` để hiển thị performance monitor
- Metrics sẽ tự động update khi page load

#### Xem Web Vitals trong Console
- Mở Chrome DevTools Console
- Web Vitals sẽ tự động log khi page load

### 2. Production Mode

#### Vercel Dashboard
- Đăng nhập vào Vercel dashboard
- Vào tab "Analytics" và "Speed Insights"
- Xem Core Web Vitals và performance trends

#### Chrome DevTools Performance Tab
1. Mở Chrome DevTools (`F12`)
2. Vào tab "Performance"
3. Click "Record" (hoặc `Ctrl+E`)
4. Reload page hoặc interact với page
5. Stop recording
6. Analyze:
   - **Main Thread**: Xem JavaScript execution time
   - **Network**: Xem resource loading
   - **Frames**: Xem FPS và rendering issues
   - **Timings**: Xem FCP, LCP, TTI

### 3. Bundle Analysis

#### Analyze Bundle Size
```bash
bun run analyze-bundle
```

Script này sẽ:
- Phân tích `.next` build directory
- Hiển thị các file lớn nhất
- Identify các dependencies lớn

#### Next.js Bundle Analyzer (Optional)
Thêm vào `next.config.js`:
```js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)
```

Sau đó chạy:
```bash
ANALYZE=true bun run build
```

### 4. React DevTools Profiler

#### Cài đặt
1. Cài Chrome extension: [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)

#### Sử dụng
1. Mở Chrome DevTools
2. Vào tab "Profiler"
3. Click "Record" (hoặc `Ctrl+E`)
4. Interact với ứng dụng
5. Stop recording
6. Analyze:
   - **Flamegraph**: Xem component render time
   - **Ranked**: Xem components chậm nhất
   - **Interactions**: Xem user interactions và performance

### 5. Lighthouse Audit

#### Chrome DevTools
1. Mở Chrome DevTools (`F12`)
2. Vào tab "Lighthouse"
3. Chọn categories: Performance, Accessibility, Best Practices, SEO
4. Click "Analyze page load"
5. Xem report và recommendations

#### Command Line
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse http://localhost:3000 --view
```

## 🎯 Key Metrics để theo dõi

### Core Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s (Good), < 4s (Needs Improvement)
- **FID** (First Input Delay): < 100ms (Good), < 300ms (Needs Improvement)
- **CLS** (Cumulative Layout Shift): < 0.1 (Good), < 0.25 (Needs Improvement)
- **INP** (Interaction to Next Paint): < 200ms (Good), < 500ms (Needs Improvement)

### Performance Metrics
- **FCP** (First Contentful Paint): < 1.8s
- **TTI** (Time to Interactive): < 3.8s
- **TTFB** (Time to First Byte): < 800ms

### Bundle Size
- **Initial JS**: < 200KB (gzipped)
- **Total JS**: < 500KB (gzipped)
- **CSS**: < 50KB (gzipped)

## 🔍 Common Performance Issues

### 1. Large Bundle Size
**Symptoms**: Slow initial load, high TTI
**Solutions**:
- Code splitting với `dynamic()` imports
- Lazy load components không cần thiết ngay
- Remove unused dependencies
- Use tree-shaking

### 2. Slow API Calls
**Symptoms**: High TTFB, slow page transitions
**Solutions**:
- Implement caching
- Use ISR (Incremental Static Regeneration)
- Optimize database queries
- Use CDN

### 3. Large Images
**Symptoms**: Slow LCP, high bandwidth usage
**Solutions**:
- Use Next.js `Image` component
- Optimize images (WebP format)
- Implement lazy loading
- Use responsive images

### 4. Render Blocking
**Symptoms**: Slow FCP, high TTI
**Solutions**:
- Defer non-critical CSS
- Use `next/font` for fonts
- Minimize JavaScript execution time
- Use Suspense boundaries

### 5. Memory Leaks
**Symptoms**: Performance degradation over time
**Solutions**:
- Clean up event listeners
- Remove unused subscriptions
- Use React DevTools Profiler để identify leaks

## 📝 Best Practices

1. **Monitor regularly**: Check performance metrics mỗi tuần
2. **Test on real devices**: Không chỉ test trên desktop
3. **Use production builds**: Development mode không reflect production performance
4. **Profile before optimizing**: Đo lường trước khi optimize
5. **Set performance budgets**: Define limits cho bundle size và load time

## 🔗 Resources

- [Web Vitals](https://web.dev/vitals/)
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [React Profiler](https://react.dev/learn/react-developer-tools#profiler)
