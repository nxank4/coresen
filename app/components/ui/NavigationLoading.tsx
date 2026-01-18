"use client";

import { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function NavigationLoadingBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  if (!loading) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "3px",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          height: "100%",
          background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.3), transparent)",
          animation: "shimmer 1.5s infinite",
        }}
        className="dark:bg-gradient-to-r dark:from-transparent dark:via-white/30 dark:to-transparent"
      />
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}

export function NavigationLoading() {
  return (
    <Suspense fallback={null}>
      <NavigationLoadingBar />
    </Suspense>
  );
}
