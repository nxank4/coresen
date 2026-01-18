"use client";

import React, { Suspense, useState, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useTheme } from "next-themes";
import { BlobGeometry } from "./BlobGeometry";
import * as THREE from "three";

interface MorphingBlob3DProps {
  width?: number;
  height?: number;
  className?: string;
}

function BlobScene({ reducedMotion }: { reducedMotion: boolean }) {
  const timeRef = useRef(0);
  const { resolvedTheme } = useTheme();
  const { gl } = useThree();
  
  // Minimal low poly: 4 segments for simplest geometry
  const segments = 4;
  const isDark = resolvedTheme === "dark";

  useFrame((state, delta) => {
    if (reducedMotion) return;
    timeRef.current += delta;
  });

  // Material color based on theme
  const lineColor = isDark ? "#ffffff" : "#000000";
  const glowColor = isDark ? "#e5e5e5" : "#404040";

  return (
    <>
      <mesh>
        <BlobGeometry
          radius={1.2}
          segments={segments}
          speed={1.0}
          timeRef={timeRef}
        />
        <meshBasicMaterial
          color={lineColor}
          wireframe={true}
          transparent={true}
          opacity={0.9}
        />
      </mesh>
      
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.3}
        rotateSpeed={0.5}
      />
    </>
  );
}

export function MorphingBlob3D({
  width = 400,
  height = 400,
  className = "",
}: MorphingBlob3DProps) {
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    // Check for WebGL support
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("webgl2");
      if (!gl) {
        setHasError(true);
        return;
      }
    } catch (e) {
      setHasError(true);
      return;
    }
    
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    
    // Set visible immediately, then use Intersection Observer for performance
    setIsVisible(true);
    
    // Intersection Observer for performance (pause when not visible)
    if (containerRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsVisible(entry.isIntersecting);
        },
        { threshold: 0.1 }
      );
      observer.observe(containerRef.current);
      
      return () => {
        mediaQuery.removeEventListener("change", handleChange);
        observer.disconnect();
      };
    }
  }, []);

  if (!mounted) {
    return null;
  }

  if (hasError) {
    // Fallback: simple gradient circle
    return (
      <div
        ref={containerRef}
        className={`relative ${className} flex items-center justify-center`}
        style={{ width, height }}
      >
        <div className="w-48 h-48 rounded-full bg-gradient-to-br from-neutral-400 to-neutral-600 dark:from-neutral-500 dark:to-neutral-700 opacity-50 blur-3xl" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ width, height }}
    >
      {isVisible && (
        <Canvas
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          camera={{ position: [0, 0, 5], fov: 50 }}
          dpr={[1, 2]}
          style={{ background: "transparent" }}
        >
          <Suspense fallback={null}>
            <BlobScene reducedMotion={reducedMotion} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
