import * as THREE from "three";

export interface Vertex {
  x: number;
  y: number;
  z: number;
}

/**
 * Extract unique vertices from Three.js geometry
 * Ensures we get the correct vertex count and positions
 * Three.js geometries already have vertices normalized to the specified radius
 */
function extractUniqueVertices(geometry: THREE.BufferGeometry): Vertex[] {
  const positions = geometry.attributes.position;
  const uniqueVertices = new Map<string, Vertex>();
  const tolerance = 0.0001; // For floating point comparison
  
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const z = positions.getZ(i);
    
    // Round to tolerance to find unique vertices
    const key = `${Math.round(x / tolerance)},${Math.round(y / tolerance)},${Math.round(z / tolerance)}`;
    
    if (!uniqueVertices.has(key)) {
      uniqueVertices.set(key, { x, y, z });
    }
  }
  
  return Array.from(uniqueVertices.values());
}

/**
 * Generate low poly sphere vertices (minimal vertices)
 */
export function generateSphereVertices(radius: number = 1, segments: number = 4): Vertex[] {
  const geom = new THREE.SphereGeometry(radius, segments, segments);
  const positions = geom.attributes.position.array as Float32Array;
  const vertices: Vertex[] = [];
  
  for (let i = 0; i < positions.length; i += 3) {
    vertices.push({
      x: positions[i],
      y: positions[i + 1],
      z: positions[i + 2],
    });
  }
  
  return vertices;
}

/**
 * Generate octahedron vertices (6 unique vertices, 8 faces)
 * Regular octahedron - dual of cube, extracted from Three.js geometry
 */
export function generateOctahedronVertices(radius: number = 1): Vertex[] {
  const geom = new THREE.OctahedronGeometry(radius, 0);
  return extractUniqueVertices(geom);
}

/**
 * Generate tetrahedron vertices (4 unique vertices)
 * Regular tetrahedron - extracted from Three.js geometry to ensure correctness
 */
export function generateTetrahedronVertices(radius: number = 1): Vertex[] {
  const geom = new THREE.TetrahedronGeometry(radius, 0);
  return extractUniqueVertices(geom);
}

/**
 * Generate cube vertices (8 unique vertices)
 * Regular hexahedron (cube) - extracted from Three.js geometry
 */
export function generateCubeVertices(radius: number = 1): Vertex[] {
  const geom = new THREE.BoxGeometry(radius * 2, radius * 2, radius * 2, 1, 1, 1);
  return extractUniqueVertices(geom);
}

/**
 * Generate icosahedron vertices (12 unique vertices)
 * Regular icosahedron - 20 triangular faces, extracted from Three.js geometry
 */
export function generateIcosahedronVertices(radius: number = 1): Vertex[] {
  const geom = new THREE.IcosahedronGeometry(radius, 0);
  return extractUniqueVertices(geom);
}

/**
 * Generate dodecahedron vertices (20 unique vertices)
 * Regular dodecahedron - 12 pentagonal faces, dual of icosahedron
 * Extracted from Three.js geometry to ensure correctness
 */
export function generateDodecahedronVertices(radius: number = 1): Vertex[] {
  const geom = new THREE.DodecahedronGeometry(radius, 0);
  return extractUniqueVertices(geom);
}

/**
 * Find nearest vertex in target shape based on spherical coordinates
 */
export function findNearestVertex(
  sourceVertex: Vertex,
  targetVertices: Vertex[]
): Vertex {
  let nearest = targetVertices[0];
  let maxDot = -Infinity;
  
  const sourceLength = Math.sqrt(
    sourceVertex.x * sourceVertex.x +
    sourceVertex.y * sourceVertex.y +
    sourceVertex.z * sourceVertex.z
  );
  
  if (sourceLength === 0) return nearest;
  
  const normalizedSource = {
    x: sourceVertex.x / sourceLength,
    y: sourceVertex.y / sourceLength,
    z: sourceVertex.z / sourceLength,
  };
  
  for (const target of targetVertices) {
    const targetLength = Math.sqrt(
      target.x * target.x + target.y * target.y + target.z * target.z
    );
    if (targetLength === 0) continue;
    
    const normalizedTarget = {
      x: target.x / targetLength,
      y: target.y / targetLength,
      z: target.z / targetLength,
    };
    
    // Dot product to find closest direction
    const dot =
      normalizedSource.x * normalizedTarget.x +
      normalizedSource.y * normalizedTarget.y +
      normalizedSource.z * normalizedTarget.z;
    
    if (dot > maxDot) {
      maxDot = dot;
      nearest = target;
    }
  }
  
  return nearest;
}

/**
 * Smoothstep easing function for seamless transitions
 */
export function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

/**
 * Cubic ease-in-out for smooth morphing
 */
export function easeInOutCubic(t: number): number {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Linear interpolation between two vertices
 */
export function lerpVertex(
  a: Vertex,
  b: Vertex,
  t: number
): Vertex {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    z: a.z + (b.z - a.z) * t,
  };
}
