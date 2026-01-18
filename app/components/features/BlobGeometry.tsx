"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  generateSphereVertices,
  generateTetrahedronVertices,
  generateCubeVertices,
  generateOctahedronVertices,
  generateDodecahedronVertices,
  generateIcosahedronVertices,
  findNearestVertex,
  lerpVertex,
  easeInOutCubic,
  type Vertex,
} from "../../lib/utils/polyhedra";

interface BlobGeometryProps {
  radius?: number;
  segments?: number;
  speed?: number;
  timeRef: React.MutableRefObject<number>;
}

// Shape cycle: từ đơn giản đến phức tạp (theo số vertices tăng dần)
// Tetrahedron (4) → Octahedron (6) → Cube (8) → Icosahedron (12) → Dodecahedron (20) → Sphere (nhiều nhất)
const SHAPE_NAMES = ["tetrahedron", "octahedron", "cube", "icosahedron", "dodecahedron", "sphere"] as const;
const CYCLE_DURATION = 18; // Total cycle duration in seconds
const SHAPE_DURATION = CYCLE_DURATION / SHAPE_NAMES.length; // ~3 seconds per shape

export function BlobGeometry({
  radius = 1.2,
  segments = 4, // Minimal low poly: 4 segments = ~16 vertices
  speed = 1.0,
  timeRef,
}: BlobGeometryProps) {
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const sphereVerticesRef = useRef<Vertex[]>([]);
  const polyhedraVerticesRef = useRef<Vertex[][]>([]);

  // Create base low poly sphere geometry
  const geometry = useMemo(() => {
    const geom = new THREE.SphereGeometry(radius, segments, segments);
    return geom;
  }, [radius, segments]);

  // Pre-compute all polyhedra vertices (ordered from simple to complex by vertex count)
  const { sphereVertices, polyhedraVertices } = useMemo(() => {
    const sphereVerts = generateSphereVertices(radius, segments);
    const polyVerts = [
      generateTetrahedronVertices(radius), // 4 vertices - simplest
      generateOctahedronVertices(radius), // 6 vertices
      generateCubeVertices(radius), // 8 vertices
      generateIcosahedronVertices(radius), // 12 vertices
      generateDodecahedronVertices(radius), // 20 vertices
      generateSphereVertices(radius, segments), // Most vertices - most complex
    ];
    
    sphereVerticesRef.current = sphereVerts;
    polyhedraVerticesRef.current = polyVerts;
    
    return { sphereVertices: sphereVerts, polyhedraVertices: polyVerts };
  }, [radius, segments]);

  // Morph vertices between polyhedra
  useFrame(() => {
    const geom = geometryRef.current || geometry;
    if (!geom || sphereVerticesRef.current.length === 0) return;

    const positions = geom.attributes.position.array as Float32Array;
    const time = timeRef.current * speed;
    
    // Calculate current shape index and progress
    const cycleTime = time % CYCLE_DURATION;
    const shapeIndex = Math.floor(cycleTime / SHAPE_DURATION);
    const shapeProgress = (cycleTime % SHAPE_DURATION) / SHAPE_DURATION;
    
    // Get current and next shapes (seamless loop)
    const currentShapeIndex = Math.min(shapeIndex, SHAPE_NAMES.length - 1);
    const nextShapeIndex = (currentShapeIndex + 1) % SHAPE_NAMES.length;
    
    const currentShapeVertices = polyhedraVerticesRef.current[currentShapeIndex];
    const nextShapeVertices = polyhedraVerticesRef.current[nextShapeIndex];
    
    // Apply smooth easing for seamless transition
    const easedProgress = easeInOutCubic(shapeProgress);
    
    // Morph each vertex using sphere vertices as reference
    const vertexCount = positions.length / 3;
    const sphereVerts = sphereVerticesRef.current;
    
    for (let i = 0; i < vertexCount; i += 1) {
      // Use sphere vertex as reference point for mapping
      const sphereVertex: Vertex = 
        sphereVerts[i] || { x: positions[i * 3], y: positions[i * 3 + 1], z: positions[i * 3 + 2] };
      
      // Find nearest vertices in both shapes
      const currentNearest = findNearestVertex(sphereVertex, currentShapeVertices);
      const nextNearest = findNearestVertex(sphereVertex, nextShapeVertices);
      
      // Interpolate between current and next shape
      const morphedVertex = lerpVertex(currentNearest, nextNearest, easedProgress);
      
      // Update position
      const posIndex = i * 3;
      positions[posIndex] = morphedVertex.x;
      positions[posIndex + 1] = morphedVertex.y;
      positions[posIndex + 2] = morphedVertex.z;
    }

    geom.attributes.position.needsUpdate = true;
    geom.computeVertexNormals();
  });

  return <primitive ref={geometryRef} object={geometry} />;
}
