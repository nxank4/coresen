"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useNavigation } from "./NavigationContext";

function NavigationLoadingBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isNavigating, setNavigating } = useNavigation();
  const [loading, setLoading] = useState(false);
  const prevPathnameRef = useRef<string | null>(null);

  // Show loading when navigation starts
  useEffect(() => {
    if (isNavigating) {
      setLoading(true);
    }
  }, [isNavigating]);

  // Hide loading when pathname changes (navigation completes)
  useEffect(() => {
    if (prevPathnameRef.current !== null && prevPathnameRef.current !== pathname) {
      // Navigation completed, hide loading after a short delay
      const timer = setTimeout(() => {
        setLoading(false);
        setNavigating(false);
      }, 300);

      return () => clearTimeout(timer);
    }
    
    // Update ref
    prevPathnameRef.current = pathname;
  }, [pathname, searchParams, setNavigating]);

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
